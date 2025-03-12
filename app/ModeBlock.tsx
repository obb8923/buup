import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AppState } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Svg, { Polygon } from 'react-native-svg';

const { width: maxWidth, height: maxHeight } = Dimensions.get('window');

/**
 * Matter.js 엔진과 월드를 초기화하고,
 * 다양한 물리 객체들을 생성하여 월드에 추가합니다.
 */
const initPhysics = () => {
  // Matter.js 물리 엔진 생성 (enableSleeping: true로 설정하여 객체가 잠자는 상태 유지)
  const engine = Matter.Engine.create({ 
    enableSleeping: true,
    positionIterations: 6,  // 기본값 6, 낮추면 성능 향상
    velocityIterations: 4   // 기본값 4, 낮추면 성능 향상
  });
  // 엔진에서 월드 객체 참조 (모든 물리 객체들이 존재하는 공간)
  const world = engine.world;

  // 도형들의 스택 추가 - 여러 개의 물리 객체를 격자 형태로 배치
  // 매개변수: (시작x, 시작y, 열 수, 행 수, 열 간격, 행 간격, 콜백함수)
  const stack = Matter.Composites.stack(20, 20, 4, 4, 0, 0, (x: any, y: any) => {
    // 1~8 사이의 랜덤한 변의 수 결정 (다각형 생성 시 사용)
    const sides = Math.round(Matter.Common.random(1, 8));
    
    // 모서리 둥글기(chamfer) 설정 - 70% 확률로 적용하지 않음
    let chamfer = null;
    if (sides > 2 && Matter.Common.random() > 0.7) chamfer = { radius: 10 };
    
    // 0 또는 1의 랜덤 값으로 도형 종류 결정
    const randomCase = Math.round(Matter.Common.random(0, 1));
    
    if (randomCase === 0) { // 사각형 생성
      if (Matter.Common.random() < 0.8) { // 80% 확률로 정사각형에 가까운 사각형
        return Matter.Bodies.rectangle(
          x, y,                           // 위치 (x, y)
          Matter.Common.random(50, 100),   // 너비 (50~100 사이 랜덤) - 2배 증가
          Matter.Common.random(50, 100),   // 높이 (50~100 사이 랜덤) - 2배 증가
          { chamfer: chamfer as any }     // 모서리 둥글기 적용
        );
      } else { // 20% 확률로 길쭉한 사각형
        return Matter.Bodies.rectangle(
          x, y,
          Matter.Common.random(160, 240),  // 너비 (160~240 사이 랜덤) - 2배 증가
          Matter.Common.random(50, 60),   // 높이 (50~60 사이 랜덤) - 2배 증가
          { chamfer: chamfer as any }
        );
      }
    } else { // 다각형 생성
      return Matter.Bodies.polygon(
        x, y,
        sides,                           // 변의 수 (1~8 사이)
        Matter.Common.random(50, 100),    // 반지름 (50~100 사이 랜덤) - 2배 증가
        { chamfer: chamfer as any }
      );
    }
  });
  
  // 생성된 스택(여러 도형들의 집합)을 월드에 추가
  Matter.Composite.add(world, stack);

  // 화면 경계에 벽 추가 - 물체가 화면 밖으로 떨어지지 않도록 함
  const wallThickness = 50; // 벽 두께
  const walls = [
Matter.Bodies.rectangle(
    maxWidth / 2,                      // x 위치 (화면 중앙)
    maxHeight + wallThickness / 2,     // y 위치 (화면 아래쪽)
    maxWidth,                          // 너비 (화면 너비와 동일)
    wallThickness,                     // 높이 (벽 두께)
    { isStatic: true }                 // 고정된 물체로 설정 (움직이지 않음)
  )
  ,
  Matter.Bodies.rectangle(
    maxWidth / 2,                      // x 위치 (화면 중앙)
    -wallThickness / 2,                // y 위치 (화면 위쪽)
    maxWidth,                          // 너비 (화면 너비와 동일)
    wallThickness,                     // 높이 (벽 두께)
    { isStatic: true }                 // 고정된 물체로 설정
  )
  ,
  Matter.Bodies.rectangle(
    -wallThickness / 2,                // x 위치 (화면 왼쪽)
    maxHeight / 2,                     // y 위치 (화면 중앙)
    wallThickness,                     // 너비 (벽 두께)
    maxHeight,                         // 높이 (화면 높이와 동일)
    { isStatic: true }                 // 고정된 물체로 설정
  )
  ,
  Matter.Bodies.rectangle(
    maxWidth + wallThickness / 2,      // x 위치 (화면 오른쪽)
    maxHeight / 2,                     // y 위치 (화면 중앙)
    wallThickness,                     // 너비 (벽 두께)
    maxHeight,                         // 높이 (화면 높이와 동일)
    { isStatic: true }                 // 고정된 물체로 설정
  )
  ];
  // 생성된 모든 벽을 월드에 추가
  Matter.Composite.add(world, walls);
  // 초기화된 엔진과 월드를 반환
  return { engine, world };
};

/**
 * 매 프레임 Matter 엔진 업데이트 시스템
 */
const PhysicsUpdate = (entities: any, { time }: any) => {
  let engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

/**
 * 터치 이벤트(시작, 이동, 종료)에 따라 Matter.Constraint를 생성∙업데이트∙제거하여
 * 터치 드래그로 도형을 움직일 수 있게 합니다.
 */
const TouchHandler = (entities: any, { touches }: any) => {
  let engine = entities.physics.engine;
  if (!entities.mouse) {
    entities.mouse = { dragConstraint: null };
  }
  touches.forEach((t: any) => {
    if (t.type === 'start') {
      const pos = { x: t.event.pageX, y: t.event.pageY };
      const bodies = Matter.Composite.allBodies(engine.world);
      const foundBodies = Matter.Query.point(bodies, pos);
      if (foundBodies.length > 0) {
        const body = foundBodies[0];
        const constraint = Matter.Constraint.create({
          pointA: pos,
          bodyB: body,
          pointB: { x: 0, y: 0 },
          stiffness: 0.1,
          damping: 0.1,
        });
        Matter.Composite.add(engine.world, constraint);
        entities.mouse.dragConstraint = constraint;
      }
    } else if (t.type === 'move') {
      if (entities.mouse.dragConstraint) {
        entities.mouse.dragConstraint.pointA = { x: t.event.pageX, y: t.event.pageY };
      }
    } else if (t.type === 'end') {
      if (entities.mouse.dragConstraint) {
        Matter.Composite.remove(engine.world, entities.mouse.dragConstraint);
        entities.mouse.dragConstraint = null;
      }
    }
  });
  return entities;
};


/**
 * MatterRenderer는 react-native-svg를 사용해
 * Matter 엔진의 모든 body들을 그려줍니다.
 */
const MatterRenderer = ({ engine }: { engine: Matter.Engine }) => {
  // Matter.Composite.allBodies()를 사용해 모든 body들을 얻습니다.
  const bodies = Matter.Composite.allBodies(engine.world);
  return (
    <Svg height={maxHeight} width={maxWidth} style={StyleSheet.absoluteFill}>
      {bodies.map((body, index) => {
        const points = body.vertices.map(v => `${v.x},${v.y}`).join(' ');
        return (
          <Polygon
            key={index}
            points={points}
            fill="rgba(0,0,255,0.5)"
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
    </Svg>
  );
};

/**
 * useTick 훅은 매 프레임마다 재렌더링을 위한 상태 업데이트를 수행합니다.
 */
const useTick = () => {
  const [tick, setTick] = useState(0);
  const frameRef = useRef<number>();
  
  useEffect(() => {
    let lastTime = 0;
    const targetFPS = 30; // 60에서 30으로 감소 - 성능 향상
    const frameInterval = 1000 / targetFPS;
    
    const update = (time: number) => {
      if (time - lastTime >= frameInterval) {
        setTick(t => t + 1);
        lastTime = time;
      }
      frameRef.current = requestAnimationFrame(update);
    };
    
    frameRef.current = requestAnimationFrame(update);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
  
  return tick;
};

export default function ModeBlock() {
  // Physics 엔진과 월드를 초기화합니다.
  const physics = useRef(initPhysics()).current;
  // 매 프레임마다 갱신할 tick 값 (MatterRenderer의 재렌더링 용도)
  const tick = useTick();
  
  // 메모이제이션된 MatterRenderer 컴포넌트
  const memoizedRenderer = React.useMemo(() => (
    <MatterRenderer engine={physics.engine} />
  ), [tick, physics.engine]);

  // 물리 엔진 일시정지 상태 관리
  const [isPaused, setIsPaused] = useState(false);
  
  // 화면이 보이지 않을 때 물리 엔진 일시정지
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState.match(/inactive|background/)) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    
    // AppState 이벤트 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  // 물리 엔진 업데이트 시스템
  const systems = React.useMemo(() => {
    return isPaused ? [] : [PhysicsUpdate, TouchHandler];
  }, [isPaused]);

  return (
    <View style={{ flex: 1, backgroundColor: '#d1d1d1' }}>
      <GameEngine
        style={styles.gameContainer}
        systems={systems}
        entities={{
          physics: { engine: physics.engine, world: physics.world },
        }}
        onEvent={(event: any) => {
          console.log("onEvent", event);
        }}  
      />
      {/* 메모이제이션된 렌더러 사용 */}
      {memoizedRenderer}
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  }
});

