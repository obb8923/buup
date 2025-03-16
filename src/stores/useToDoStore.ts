import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../i18n';

export type RepetitionType = 'none'| 'daily'| 'weekly'| 'monthly' | '매일' | '매주' | '매월';
export interface ToDoItemType {
  id: string;          // 할 일의 고유 식별자
  content: string;     // 할 일의 내용
  completed: boolean;  // 완료 여부
  createdAt: Date;     // 생성 날짜
  deadline: Date | null;     // 완료 기한
  emoji: string;      // 할 일을 기억하기 쉽게 하는 이모지
  repetition: RepetitionType; // 반복 설정 추가
}

interface ToDoState {
  todos: ToDoItemType[];                               
  isLoading: boolean;                                 
  addTodo: (content: string, emoji: string, deadlineStr: string | null, repetition: RepetitionType) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodoContent: (id: string, content: string, deadline?: Date | null, emoji?: string, repetition?: RepetitionType) => Promise<void>;
  moveTodoUp: (id: string) => Promise<void>;
  moveTodoDown: (id: string) => Promise<void>;
  reorderTodos: (newOrder: ToDoItemType[]) => Promise<void>;
  sortByDeadline: () => Promise<void>;
  loadTodos: () => Promise<void>;
  updateRecurringTodos: () => Promise<void>;
}

// AsyncStorage 키
const TODOS_STORAGE_KEY = '@ToyDo:todos';

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
    
    // console.log('복원된 데이터:', JSON.stringify(result, null, 2));
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
    content: t('initialTodos.todo1'),
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    emoji: "💻",
    repetition: "none",
  },
  {
    id: "2",
    content: "주방과 화장실 청소하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(),
    emoji: "🧹",
    repetition: "daily",
  },
  {
    id: "3",
    content: "고양이 사료 사러가기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    emoji: "🐱",
    repetition: "none",
  },
  {
    id: "4",
    content: "이메일 확인하기",
    completed: true,
    createdAt: new Date(),
    deadline: new Date(Date.now()),
    emoji: "📧",
    repetition: "daily",
  },
  {
    id: "5",
    content: "일기 쓰기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now()),
    emoji: "💭",
    repetition: "daily",
  },
  {
    id: "6",
    content: "화분에 물주기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    emoji: "🪴",
    repetition: "weekly",
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
    
    // console.log('불러온 원시 데이터:', storedData.substring(0, 200) + '...');
    const todos = deserializeTodos(storedData);
    
    // console.log('불러온 데이터:', todos.map(todo => ({
    //   id: todo.id,
    //   deadline: todo.deadline,
    //   repetition: todo.repetition
    // })));
    
    return todos;
  } catch (error) {
    console.error('할 일 불러오기 오류:', error);
    return [];
  }
};

// 날짜가 지난 반복 할 일을 업데이트하는 함수
const updateRecurringTodoDeadlines = (todos: ToDoItemType[]): ToDoItemType[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // 현재 날짜만 비교하기 위해 시간 초기화
  
  return todos.map(todo => {
    // 마감일이 없거나 반복 설정이 없으면 그대로 반환
    if (!todo.deadline || todo.repetition === 'none') {
      return todo;
    }
    
    const deadlineDate = new Date(todo.deadline);
    deadlineDate.setHours(0, 0, 0, 0); // 시간 초기화
    
    // 마감일이 오늘 이전이면 (지났으면) 반복 설정에 따라 새 마감일 설정
    if (deadlineDate < now) {
      const newTodo = { ...todo };
      let newDeadline = new Date(deadlineDate);
      
      // 반복 유형에 따라 새 마감일 계산
      switch (todo.repetition) {
        case 'daily':
          // 하루씩 더해서 오늘 이후가 될 때까지 반복
          while (newDeadline < now) {
            newDeadline.setDate(newDeadline.getDate() + 1);
          }
          break;
          
        case 'weekly':
          // 7일씩 더해서 오늘 이후가 될 때까지 반복
          while (newDeadline < now) {
            newDeadline.setDate(newDeadline.getDate() + 7);
          }
          break;
          
        case 'monthly':
          // 한 달씩 더해서 오늘 이후가 될 때까지 반복
          while (newDeadline < now) {
            newDeadline.setMonth(newDeadline.getMonth() + 1);
          }
          break;
      }
      
      newTodo.deadline = newDeadline;
      
      // 완료된 할 일은 미완료 상태로 초기화
      if (newTodo.completed) {
        newTodo.completed = false;
      }
      
      return newTodo;
    }
    
    return todo;
  });
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
      
      // 할 일 로드 후 반복 할 일 업데이트 실행
      const store = useToDoStore.getState();
      await store.updateRecurringTodos();
    } catch (error) {
      console.error('할 일 불러오기 실패:', error);
      set({ isLoading: false, todos: [] });
    }
  },
  
  // 반복 할 일 업데이트
  updateRecurringTodos: async () => {
    try {
      const todos = get().todos;
      const updatedTodos = updateRecurringTodoDeadlines(todos);
      
      // 변경사항이 있는지 확인
      const hasChanges = JSON.stringify(todos) !== JSON.stringify(updatedTodos);
      
      if (hasChanges) {
        set({ todos: updatedTodos });
        await saveTodosToStorage(updatedTodos);
        console.log('반복 할 일 업데이트 완료');
      }
    } catch (error) {
      console.error('반복 할 일 업데이트 오류:', error);
    }
  },
  
  // 할 일 추가
  addTodo: async (content: string, emoji: string, deadlineStr: string | null, repetition: string) => {
    try {
      let deadlineDate:Date | null = null;
      console.log("deadlineStr", deadlineStr)
      if (deadlineStr) {
        const now = new Date();
        if (deadlineStr === t('todo.input.today')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        } else if (deadlineStr === t('todo.input.tomorrow')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
        } else if (deadlineStr === t('todo.input.inAWeek')) {
          deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59);
        } else {
          // 'yyyy-MM-dd' 형식의 문자열을 Date 객체로 변환
          const [year, month, day] = deadlineStr.split('-').map(Number);
          deadlineDate = new Date(year, month - 1, day, 23, 59, 59);
        }
      } else if (deadlineStr === null) {
        deadlineDate = null;
      }
      const finalRepetition: RepetitionType = repetition as RepetitionType;
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
  editTodoContent: async (id: string, content: string, deadline?: Date | null, emoji?: string, repetition?: RepetitionType) => {
    try {
      const updatedTodos = get().todos.map((todo) => {
        if (todo.id === id) {
          // deadline이 명시적으로 null이면 null 사용, 아니면 전달된 deadline 또는 기존 값 사용
          const updatedDeadline = deadline !== undefined ? deadline : todo.deadline;
          
          // repetition 값이 없으면 기존 값 유지, 기존 값도 없으면 'none' 설정
          const updatedRepetition: RepetitionType = repetition !== undefined ? repetition : (todo.repetition || 'none');
          
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
  
  // 미들웨어로 정기적인 업데이트 설정
  setupRecurringUpdateCheck();
};

// 정기적인 업데이트 체크를 위한 함수
const setupRecurringUpdateCheck = () => {
  // 하루가 바뀔 때 체크하기 위해 자정에 호출되도록 설정
  const checkForMidnight = () => {
    const now = new Date();
    const store = useToDoStore.getState();
    
    // 매 시간마다 반복 할 일 업데이트 확인
    store.updateRecurringTodos();
    
    // 다음 확인을 1시간 후로 설정
    setTimeout(checkForMidnight, 60 * 60 * 1000);
  };
  
  // 첫 실행
  checkForMidnight();
};

// 스토어 초기화 실행
initializeStore();

export default useToDoStore;
