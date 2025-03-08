import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../i18n';

export interface ToDoItemType {
  id: string;          // 할 일의 고유 식별자
  content: string;     // 할 일의 내용
  completed: boolean;  // 완료 여부
  createdAt: Date;     // 생성 날짜
  deadline: Date | null;     // 완료 기한
  emoji: string;      // 할 일을 기억하기 쉽게 하는 이모지
  repetition: string; // 반복 설정 추가
}

interface ToDoState {
  todos: ToDoItemType[];                               
  isLoading: boolean;                                 
  addTodo: (content: string, emoji: string, deadlineStr: string | null, repetition: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodoContent: (id: string, content: string, deadline?: Date | null, emoji?: string, repetition?: string) => Promise<void>;
  moveTodoUp: (id: string) => Promise<void>;
  moveTodoDown: (id: string) => Promise<void>;
  reorderTodos: (newOrder: ToDoItemType[]) => Promise<void>;
  sortByDeadline: () => Promise<void>;
  loadTodos: () => Promise<void>;
}

// AsyncStorage 키
const TODOS_STORAGE_KEY = '@buup:todos';

// 날짜를 안전하게 처리하는 직렬화 함수
const serializeTodos = (todos: ToDoItemType[]): string => {
  return JSON.stringify(todos, (key, value) => {
    if (value instanceof Date) {
      return { __date: value.toISOString() };
    }
    return value;
  });
};

// 역직렬화 시 모든 타입을 확인하는 함수
const deserializeTodos = (json: string): ToDoItemType[] => {
  try {
    const parsed = JSON.parse(json, (key, value) => {
      // 날짜 객체 복원
      if (value && typeof value === 'object' && value.__date) {
        return new Date(value.__date);
      }
      return value;
    });
    parsed.forEach((item: any) => {
      console.log('@@@@@',typeof(item.deadline));
      console.log('@@@@@',item.deadline);
    });
    
    // 유효성 검사 및 타입 보정
    const result = parsed.map((item: any) => ({
      id: String(item.id || Date.now()),
      content: String(item.content || ''),
      completed: Boolean(item.completed || false),
      createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(),
      deadline: item.deadline===null?null:new Date(item.deadline),
      emoji: item.emoji || '📝',
      repetition: ['none', 'daily', 'weekly', 'monthly'].includes(item.repetition) ? 
                  item.repetition : 'none'
    }));
    
    console.log('복원된 데이터:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('데이터 역직렬화 오류:', error);
    return []; // 오류 시 빈 배열 반환
  }
};

// 초기 데이터
const initialTodos: ToDoItemType[] = [
  {
    id: "1",
    content: "다음 주 프로젝트 계획서 작성하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    emoji: "💻",
    repetition: "none",
  },
  {
    id: "6",
    content: "주방과 화장실 청소하기",
    completed: false,
    createdAt: new Date(),
    deadline: null,
    emoji: "🧹",
    repetition: "daily",
  }
];

// AsyncStorage에 저장하는 함수
const saveTodosToStorage = async (todos: ToDoItemType[]): Promise<void> => {
  try {
    const serialized = serializeTodos(todos);
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('할 일 저장 오류:', error);
  }
};

// AsyncStorage에서 불러오는 함수
const loadTodosFromStorage = async (): Promise<ToDoItemType[]> => {
  try {
    const storedData = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    
    if (!storedData) {
      await saveTodosToStorage(initialTodos);
      return initialTodos;
    }
    
    console.log('불러온 원시 데이터:', storedData.substring(0, 200) + '...');
    const todos = deserializeTodos(storedData);
    
    console.log('불러온 데이터:', todos.map(todo => ({
      id: todo.id,
      deadline: todo.deadline,
      repetition: todo.repetition
    })));
    
    return todos;
  } catch (error) {
    console.error('할 일 불러오기 오류:', error);
    return [];
  }
};

const useToDoStore = create<ToDoState>((set, get) => ({
  todos: [],
  isLoading: true,
  
  // 할 일 목록 로드
  loadTodos: async () => {
    set({ isLoading: true });
    try {
      const todos = await loadTodosFromStorage();
      set({ todos, isLoading: false });
    } catch (error) {
      console.error('할 일 불러오기 실패:', error);
      set({ isLoading: false, todos: [] });
    }
  },
  
  // 할 일 추가
  addTodo: async (content: string, emoji: string, deadlineStr: string | null, repetition: string) => {
    try {
      let deadlineDate:Date | null = null;
      
      if (deadlineStr) {
        const now = new Date();
        if (deadlineStr === t('todo.input.today')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        } else if (deadlineStr === t('todo.input.tomorrow')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
        } else if (deadlineStr === t('todo.input.inAWeek')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59);
        }
      } else if (deadlineStr === null) {
        deadlineDate = null;
      }
      const finalRepetition: string = repetition || 'none';
      
      const newTodo: ToDoItemType = {
        id: Date.now().toString(),
        content,
        completed: false,
        createdAt: new Date(),
        deadline: deadlineDate,
        emoji: emoji || '📝',
        repetition: finalRepetition,
      };
      
      const updatedTodos = [newTodo, ...get().todos];
      set({ todos: updatedTodos });
      await saveTodosToStorage(updatedTodos);
    } catch (error) {
      console.error('할 일 추가 오류:', error);
    }
  },
  
  // 할 일 삭제
  removeTodo: async (id: string) => {
    try {
      const updatedTodos = get().todos.filter((todo) => todo.id !== id);
      set({ todos: updatedTodos });
      await saveTodosToStorage(updatedTodos);
    } catch (error) {
      console.error('할 일 삭제 오류:', error);
    }
  },
  
  // 할 일 완료 상태 토글
  toggleTodo: async (id: string) => {
    try {
      const updatedTodos = get().todos.map((todo) => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      set({ todos: updatedTodos });
      await saveTodosToStorage(updatedTodos);
    } catch (error) {
      console.error('할 일 토글 오류:', error);
    }
  },
  
  // 할 일 내용 수정
  editTodoContent: async (id: string, content: string, deadline?: Date | null, emoji?: string, repetition?: string) => {
    try {
      const updatedTodos = get().todos.map((todo) => {
        if (todo.id === id) {
          // deadline이 명시적으로 null이면 null 사용, 아니면 전달된 deadline 또는 기존 값 사용
          const updatedDeadline = deadline !== undefined ? deadline : todo.deadline;
          
          // repetition 값이 없으면 기존 값 유지, 기존 값도 없으면 'none' 설정
          const updatedRepetition: string = repetition !== undefined ? repetition : (todo.repetition || 'none');
          
          console.log('수정:', { id, content, deadline, updatedDeadline, repetition, updatedRepetition });
          
          return { 
            ...todo, 
            content, 
            deadline: updatedDeadline,
            emoji: emoji !== undefined ? emoji : todo.emoji,
            repetition: updatedRepetition
          };
        }
        return todo;
      });
      
      set({ todos: updatedTodos });
      await saveTodosToStorage(updatedTodos);
    } catch (error) {
      console.error('할 일 수정 오류:', error);
    }
  },
  
  // 할 일을 위로 이동
  moveTodoUp: async (id: string) => {
    try {
      const todos = get().todos;
      const index = todos.findIndex(todo => todo.id === id);
      if (index <= 0) return;
      
      const newTodos = [...todos];
      const temp = newTodos[index];
      newTodos[index] = newTodos[index - 1];
      newTodos[index - 1] = temp;
      
      set({ todos: newTodos });
      await saveTodosToStorage(newTodos);
    } catch (error) {
      console.error('할 일 위로 이동 오류:', error);
    }
  },
  
  // 할 일을 아래로 이동
  moveTodoDown: async (id: string) => {
    try {
      const todos = get().todos;
      const index = todos.findIndex(todo => todo.id === id);
      if (index === -1 || index >= todos.length - 1) return;
      
      const newTodos = [...todos];
      const temp = newTodos[index];
      newTodos[index] = newTodos[index + 1];
      newTodos[index + 1] = temp;
      
      set({ todos: newTodos });
      await saveTodosToStorage(newTodos);
    } catch (error) {
      console.error('할 일 아래로 이동 오류:', error);
    }
  },
  
  // 할 일 순서 변경
  reorderTodos: async (newOrder: ToDoItemType[]) => {
    try {
      set({ todos: newOrder });
      await saveTodosToStorage(newOrder);
    } catch (error) {
      console.error('할 일 순서 변경 오류:', error);
    }
  },
  
  // 완료 기한 기준 정렬
  sortByDeadline: async () => {
    try {
      const todos = get().todos;
      const currentOrder = todos.map(todo => todo.id).join(',');   
      const sortedTodos = [...todos].sort((a, b) => {
        // null 또는 undefined 처리
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        
        // Date 객체인지 확인하고 타임스탬프 계산
        try {
          const aTime = a.deadline instanceof Date ? a.deadline.getTime() : 0;
          const bTime = b.deadline instanceof Date ? b.deadline.getTime() : 0;
          return aTime - bTime;
        } catch (error) {
          console.error('정렬 오류:', error, { a: a.deadline, b: b.deadline });
          return 0;
        }
      });
      
      const newOrder = sortedTodos.map(todo => todo.id).join(',');
      if (currentOrder === newOrder) {
        return;
      }
      
      set({ todos: sortedTodos });
      await saveTodosToStorage(sortedTodos);
    } catch (error) {
      console.error('정렬 오류:', error);
    }
  },
}));

// 앱 시작 시 데이터 로드
const initializeStore = async () => {
  const store = useToDoStore.getState();
  await store.loadTodos();
};

// 스토어 초기화 실행
initializeStore();

export default useToDoStore;
