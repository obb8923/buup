import { Dimensions } from 'react-native';
import { generatePoints, getMaxPointsCount } from './poissonDiskSampling';
import { ToDoItemType } from '../../stores/useToDoStore';

// 새로운 타입 정의
export type BubbleEntity = {
  id: string;
  targetPosition: [number, number];
  renderer: React.ComponentType<any>;
  todoData: ToDoItemType; // 할 일 데이터 추가
};

export type Entities = {
  bubbles: BubbleEntity[];
};

// 초기 엔티티 설정 함수
export const setupEntities = (
  Bubble: React.ComponentType<any>, 
  todos: ToDoItemType[],
  maxCount?: number // 최대 버블 개수를 매개변수로 받음
) => {
  // 화면 크기 계산
  const { width, height } = Dimensions.get('window');
  
  // 최대 포인트 개수 설정 (매개변수로 전달 받거나 계산)
  const maxPointsCount = maxCount !== undefined ? maxCount : getMaxPointsCount();
  
  // 최대 포인트 개수와 할 일 개수 중 작은 값으로 버블 개수 설정
  const bubbleCount = Math.min(todos.length, maxPointsCount);
  
  // 화면에 표시할 할 일 목록 (최대 개수만큼만)
  const displayTodos = todos.slice(0, bubbleCount);
  
  // 필요한 개수만큼의 목표 좌표 생성
  const targetPoints = generatePoints(bubbleCount);
  
  // 버블 엔티티 배열 생성
  const bubbles: BubbleEntity[] = displayTodos.map((todo, index) => {
    // 좌표가 없으면 화면 중앙으로 설정
    const point = targetPoints[index] || [width/2, height/2];
    return {
      id: todo.id, // 할 일의 ID 사용
      targetPosition: [point[0], point[1]] as [number, number], // 타입 명시적 변환
      renderer: Bubble,
      todoData: todo // 할 일 데이터 저장
    };
  });

  return {
    bubbles
  };
};

// 애니메이션 리셋 함수
export const resetAnimation = (
  setEntities: React.Dispatch<React.SetStateAction<Entities | null>>,
  setShouldReset: React.Dispatch<React.SetStateAction<boolean>>,
  Bubble: React.ComponentType<any>,
  todos: ToDoItemType[],
  maxCount?: number // 최대 버블 개수를 매개변수로 받음
) => {
  setEntities(null); // 기존 엔티티 제거
  setTimeout(() => {
    setEntities(setupEntities(Bubble, todos, maxCount)); // 최대 개수 전달
    setShouldReset(prev => !prev); // boolean 값 토글
  }, 100);
}; 