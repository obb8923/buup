import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import { frame } from './frame';
import { BubbleConstant as BC} from '../../constants/bubbleConstant';
import { generatePoints } from './poissonDiskSampling';
// 엔티티 타입 정의
export type WallEntity = {
  body: Matter.Body;
  size: number[] | [number, number]; // 배열 또는 튜플 모두 허용
  renderer: React.ComponentType<any>;
};

export type BubbleEntity = {
  body: Matter.Body;
  size: number;
  renderer: React.ComponentType<any>;
};

export type Entities = {
  physics: { engine: Matter.Engine; world: Matter.World };
  [key: string]: any; // 이 부분이 bubble-0, bubble-1 등의 동적 키를 허용 그리고 wall-0, wall-1 등의 동적 키를 허용
};

// 초기 엔티티 설정 함수
export const setupEntities = (Bubble: React.ComponentType<any>, Box: React.ComponentType<any>) => {
  // 화면 크기 계산
  const { width, height } = Dimensions.get('window');
  // 물리 엔진 설정
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = 0;
  const world = engine.world;
  
  // 버블 개수 설정 및 목표 좌표 생성
  const bubbleCount = 10; // 원하는 버블 개수
  const targetPoints = generatePoints(bubbleCount); // 버블이 향할 목표 좌표
  
  // 버블 배열 생성 - 화면 아래에서 시작
  const bubbleArray: Matter.Body[] = []

  for (let i = 0; i < targetPoints.length; i++) {
    // 화면 아래에서 랜덤한 x 위치에 버블 생성
    const startX = targetPoints[i][0];
    const startY = targetPoints[i][1] + height; // 화면 아래에서 시작
    
    const bubble = Matter.Bodies.circle(startX, startY, BC.size, { 
      restitution: BC.restitution,
      frictionAir: BC.airFriction,
      density: BC.density,
      label: `bubble-${i}`
    });
    
    // 각 버블에 목표 좌표 정보 추가
    bubble.plugin = {
      targetX: targetPoints[i][0],
      targetY: targetPoints[i][1]
    };
    
    bubbleArray.push(bubble);
  }
 
  const { walls, wallThickness } = frame(width, height);
  // 물리 엔진에 물체 추가
  Matter.World.add(world, [ ...bubbleArray, ...walls]);
  
  // 부력 적용 및 목표 위치로 이동
  const buoyancyForceMagnitude = BC.buoyancy;  // 부력 크기
  const attractionStrength = 0.00001; // 목표 위치로 향하는 힘의 강도
  
  Matter.Events.on(engine, 'beforeUpdate', function() {
    bubbleArray.forEach((bubble) => {
      if (bubble.plugin && bubble.plugin.targetX !== undefined) {
        const target = {
          x: bubble.plugin.targetX,
          y: bubble.plugin.targetY
        };
        
        const direction = {
          x: target.x - bubble.position.x,
          y: target.y - bubble.position.y
        };
        
        // 거리 계산
        const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        
        // 항상 부력을 적용 (목표에 도달하는 동안 계속 가속)
        const buoyancyForce = {
          x: 0,
          y: -buoyancyForceMagnitude * bubble.area
        };
        Matter.Body.applyForce(bubble, bubble.position, buoyancyForce);
        
        if (distance > 10) { // 목표와 일정 거리 이상 떨어져 있을 때
          // 목표 방향으로 약한 인력 적용
          const attractionForce = {
            x: direction.x * attractionStrength * bubble.mass,
            y: direction.y * attractionStrength * bubble.mass
          };
          Matter.Body.applyForce(bubble, bubble.position, attractionForce);
        } else {
          // 목표에 가까워지면 강한 고정력 적용
          const strongStabilizingForce = {
            x: direction.x * 0.005 * bubble.mass,
            y: direction.y * 0.005 * bubble.mass
          };
          Matter.Body.applyForce(bubble, bubble.position, strongStabilizingForce);
          
          // 미세한 떨림 효과 추가 (매우 작은 값)
          const tinyMovement = {
            x: (Math.random() - 0.5) * 0.00000005 * bubble.area,
            y: (Math.random() - 0.5) * 0.00000005 * bubble.area
          };
          Matter.Body.applyForce(bubble, bubble.position, tinyMovement);
        }
      }
    });
  });

  return {
    physics: { engine, world },
    // 각 버블에 고유 ID를 부여하여 렌더링 문제 해결
    ...bubbleArray.reduce((acc: Record<string, BubbleEntity>, bubble, index) => {
      acc[`bubble-${index}`] = { 
        body: bubble, 
        size: BC.size, 
        renderer: Bubble 
      };
      return acc;
    }, {}),
    // 벽 배열 생성
    ...walls.reduce((acc: Record<string, WallEntity>, wall, index) => {
      acc[`wall-${index}`] = { 
        body: wall, 
        size: [wallThickness, height] as [number, number], 
        renderer: Box 
      };
      return acc;
    }, {}),
  };
};

// 애니메이션 리셋 함수
export const resetAnimation = (
  setEntities: React.Dispatch<React.SetStateAction<Entities | null>>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  Bubble: React.ComponentType<any>,
  Box: React.ComponentType<any>
) => {
  setEntities(null); // 기존 엔티티 제거
  setTimeout(() => {
    setEntities(setupEntities(Bubble, Box)); // 새 엔티티 생성
    setKey(prevKey => prevKey + 1); // 키 업데이트
  }, 100);
}; 