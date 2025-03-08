import { Dimensions } from 'react-native';
import { generatePoints } from './poissonDiskSampling';
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

// 초기 엔티티 설정 함수 (Matter.js 종속성 제거)
export const setupEntities = (Bubble: React.ComponentType<any>, todos: ToDoItemType[]) => {
  // 화면 크기 계산
  const { width, height } = Dimensions.get('window');
  
  // 버블 개수 설정 및 목표 좌표 생성 (할 일 개수만큼)
  const bubbleCount = todos.length; // 할 일 개수만큼 버블 생성
  const targetPoints = generatePoints(bubbleCount); // 버블이 향할 목표 좌표
  
  // 버블 엔티티 배열 생성
  // todos 배열의 순서대로 targetPoints를 할당 (인덱스 0이 맨 위에 오도록)
  const bubbles: BubbleEntity[] = todos.map((todo, index) => {
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
  todos: ToDoItemType[]
) => {
  setEntities(null); // 기존 엔티티 제거
  setTimeout(() => {
    setEntities(setupEntities(Bubble, todos)); // 새 엔티티 생성
    setShouldReset(prev => !prev); // boolean 값 토글
  }, 100);
}; 