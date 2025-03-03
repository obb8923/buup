import { create } from 'zustand';

export interface ToDoItemType {
  id: string;          // 할 일의 고유 식별자
  content: string;     // 할 일의 내용
  completed: boolean;  // 완료 여부
  createdAt: Date;     // 생성 날짜
  deadline?: Date;     // 완료 기한
  emoji?: string;      // 할 일을 기억하기 쉽게 하는 이모지
}

interface ToDoState {
  todos: ToDoItemType[];                               // 할 일 목록
  addTodo: (content: string, deadline?: Date, emoji?: string) => void;            // 새 할 일 추가
  removeTodo: (id: string) => void;            // 할 일 삭제
  toggleTodo: (id: string) => void;            // 할 일 완료 상태 토글
  editTodoContent: (id: string, content: string, deadline?: Date, emoji?: string) => void; // 할 일 내용 수정
  moveTodoUp: (id: string) => void;            // 할 일을 위로 이동
  moveTodoDown: (id: string) => void;          // 할 일을 아래로 이동
  reorderTodos: (newOrder: ToDoItemType[]) => void;
  sortByDeadline: () => void;                  // 완료 기한 기준 정렬
}


const mockTodos: ToDoItemType[] = [
 
  {
    id: "1",
    content: "다음 주 프로젝트 계획서 작성하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
    emoji: "💻",
  },
  {
    id: "2",
    content: "우유, 계란, 빵 구매하기",
    completed: true,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
    emoji: "🍼",
  },
  {
    id: "3",
    content: "30분 조깅하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
    emoji: "🏃‍♂️",
  },
  {
    id: "4",
    content: "리액트 네이티브 책 3장까지 읽기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
    emoji: "💻",
  },
  {
    id: "5",
    content: "중요 이메일 답장하기",
    completed: true,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
    emoji: "💻",
  },
  {
    id: "6",
    content: "치과 정기 검진 예약하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10일 후
    emoji: "💻",
  },
  {
    id: "7",
    content: "저녁 7시 카페에서 만남",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
    emoji: "💻",
  },
  {
    id: "8",
    content: "팀원 PR 검토하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
    emoji: "💻",
  },
  {
    id: "9",
    content: "내일 회의 발표자료 준비하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
    emoji: "💻",
  },
  {
    id: "10",
    content: "주방과 화장실 청소하기",
    completed: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4일 후
    emoji: "🧹",
  }
];

const useToDoStore = create<ToDoState>((set) => ({
  todos: mockTodos,
  addTodo: (content: string, deadline?: Date, emoji?: string) => set((state) => ({
    todos: [
      {
        id: Date.now().toString(),  // 현재 시간을 ID로 사용
        content,
        completed: false,
        createdAt: new Date(),
        deadline,
        emoji,
      },
      ...state.todos,
    ]
  })),
  removeTodo: (id: string) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id)
  })),
  toggleTodo: (id: string) => set((state) => ({
    todos: state.todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  editTodoContent: (id: string, content: string, deadline?: Date, emoji?: string) => set((state) => ({
    todos: state.todos.map((todo) => 
      todo.id === id ? { ...todo, content, deadline: deadline || todo.deadline, emoji: emoji !== undefined ? emoji : todo.emoji } : todo
    )
  })),
  moveTodoUp: (id: string) => set((state) => {
    const index = state.todos.findIndex(todo => todo.id === id);
    if (index <= 0) return state; // 이미 맨 위에 있으면 변경 없음
    
    const newTodos = [...state.todos];
    const temp = newTodos[index];
    newTodos[index] = newTodos[index - 1];
    newTodos[index - 1] = temp;
    
    return { todos: newTodos };
  }),
  moveTodoDown: (id: string) => set((state) => {
    const index = state.todos.findIndex(todo => todo.id === id);
    if (index === -1 || index >= state.todos.length - 1) return state; // 맨 아래에 있으면 변경 없음
    
    const newTodos = [...state.todos];
    const temp = newTodos[index];
    newTodos[index] = newTodos[index + 1];
    newTodos[index + 1] = temp;
    
    return { todos: newTodos };
  }),

  reorderTodos: (newOrder: ToDoItemType[]) => set({ todos: newOrder }),
  
  // 완료 기한 기준 정렬 함수 수정
  sortByDeadline: () => set((state) => {
    // 정렬된 할 일 목록 생성
    const sortedTodos = [...state.todos].sort((a, b) => {
      // deadline이 없는 항목은 맨 뒤로
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      // deadline이 있는 항목은 날짜순 정렬
      return a.deadline.getTime() - b.deadline.getTime();
    });
    
    return { todos: sortedTodos };
  }),
}));

export default useToDoStore;
