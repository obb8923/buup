import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, AppState } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Svg, { Polygon, Text as SvgText } from 'react-native-svg';
import useToDoStore, { ToDoItemType } from '../src/stores/useToDoStore';
import BubbleButton from '../src/components/buttons/BubbleButton';
import { router } from 'expo-router';
import { BubbleButtonZLevel } from '../src/constants/ZLevels';
import useTodoModal from '../src/libs/hooks/useTodoModal';
import TodoDetailModal from '../src/components/modals/TodoDetailModal';
import COLORS from '../src/constants/Colors';
import useThemeStore from '../src/stores/useThemeStore';
const { width: maxWidth, height: maxHeight } = Dimensions.get('window');

//  * 매 프레임 Matter 엔진 업데이트 시스템
const PhysicsUpdate = (entities: any, { time }: any) => {
  let engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};
// Matter.js 엔진과 월드를 초기화하고, 다양한 물리 객체들을 생성하여 월드에 추가합니다.
const initPhysics = (todos: ToDoItemType[]) => {
  const shapeCount = todos.length;
  const engine = Matter.Engine.create({ 
    enableSleeping: true,
    positionIterations: 12,  // 6에서 12로 증가 - 더 정확한 위치 계산
    velocityIterations: 8    // 4에서 8로 증가 - 더 정확한 속도 계산
  });
  const world = engine.world;
  // 화면 경계에 벽 추가 - 물체가 화면 밖으로 떨어지지 않도록 함
  const wallThickness = 100; 
  const walls = [
    Matter.Bodies.rectangle(
      maxWidth / 2,
      maxHeight + wallThickness / 2 -5, // 바닥을 약간 올림
      maxWidth + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    ),
    Matter.Bodies.rectangle(
      maxWidth / 2,
      -wallThickness / 2,
      maxWidth + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    ),
    Matter.Bodies.rectangle(
      -wallThickness / 2,
      maxHeight / 2,
      wallThickness,
      maxHeight + wallThickness * 2,
      { isStatic: true }
    ),
    Matter.Bodies.rectangle(
      maxWidth + wallThickness / 2,
      maxHeight / 2,
      wallThickness,
      maxHeight + wallThickness * 2,
      { isStatic: true }
    )
  ];
  Matter.Composite.add(world, walls);

  if (shapeCount > 0) {
    const columns = Math.ceil(Math.sqrt(shapeCount));
    const rows = Math.ceil(shapeCount / columns);
    const spacingX = maxWidth / (columns + 1);
    const spacingY = maxHeight / (rows + 1);
    for (let i = 0; i < shapeCount; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = spacingX * (col + 1);
      const y = spacingY * (row + 1);
      // 랜덤 케이스 결정 (0~2 사이의 랜덤 값)
      const randomCase = Math.round(Matter.Common.random(0, 2));
      // 다각형의 변 수 결정 (1~6 사이의 랜덤 값)
      const sides = Math.round(Matter.Common.random(1, 6));
      let body;
      // 1/3의 확률로 사각형이 되고 2/3의 확률로 다각형이 된다.
      if (randomCase === 0) {
        // 80% 확률로 정사각형에 가까운 직사각형 생성
        if (Matter.Common.random() < 0.8) {
          body = Matter.Bodies.rectangle(
            x, y,                           // 위치 좌표
            Matter.Common.random(50, 100),  // 너비 (50~100 사이 랜덤)
            Matter.Common.random(50, 100),  // 높이 (50~100 사이 랜덤)
            { chamfer: { radius: 10 } }     // 모서리 둥글게 처리
          );
        } else {
          // 20% 확률로 길쭉한 직사각형 생성
          body = Matter.Bodies.rectangle(
            x, y,                           // 위치 좌표
            Matter.Common.random(160, 240), // 너비 (160~240 사이 랜덤)
            Matter.Common.random(50, 60),   // 높이 (50~60 사이 랜덤)
            { chamfer: { radius: 10 } }     // 모서리 둥글게 처리
          );
        }
      } else {
        // 다각형 생성 (삼각형, 사각형, 오각형, 육각형 등)
        body = Matter.Bodies.polygon(
          x, y,                           // 위치 좌표
          sides,                          // 변의 수
          Matter.Common.random(50, 100),  // 크기 (50~100 사이 랜덤)
          { chamfer: { radius: 10 } }     // 모서리 둥글게 처리
        );
      }
      // 생성된 물리 객체에 할 일 데이터 연결
      (body as any).todoData = todos[i];
      // 생성된 물리 객체를 물리 엔진 세계에 추가
      Matter.Composite.add(world, body);
    }
  }

  return { engine, world };
};

const TouchHandler = (entities: any, { touches, setSelectedTodo }: any) => {
  let engine = entities.physics.engine;
  if (!entities.mouse) {
    entities.mouse = { dragConstraint: null, startTime: 0, startPos: { x: 0, y: 0 } };
  }

  touches.forEach((t: any) => {
    if (t.type === 'start') {
      entities.mouse.startTime = Date.now();
      entities.mouse.startPos = { x: t.event.pageX, y: t.event.pageY };

      const pos = { x: t.event.pageX, y: t.event.pageY };
      const bodies = Matter.Composite.allBodies(engine.world);
      const foundBodies = Matter.Query.point(bodies, pos);

      if (foundBodies.length > 0) {
        const body = foundBodies[0];

        const constraint = Matter.Constraint.create({
          pointA: pos,
          bodyB: body,
          pointB: { x: 0, y: 0 },
          stiffness: 0.1,  // 강성: 값이 낮을수록 더 탄력적이고 느슨하게 연결됨
          damping: 1,    // 감쇠: 값이 낮을수록 진동이 오래 지속됨
        });

        Matter.Composite.add(engine.world, constraint);
        entities.mouse.dragConstraint = constraint;
      }
    } else if (t.type === 'move') {
      if (entities.mouse.dragConstraint) {
        entities.mouse.dragConstraint.pointA = { x: t.event.pageX, y: t.event.pageY };
      }
    } else if (t.type === 'end') {
      const elapsed = Date.now() - entities.mouse.startTime;
      const endPos = { x: t.event.pageX, y: t.event.pageY };
      const dx = endPos.x - entities.mouse.startPos.x;
      const dy = endPos.y - entities.mouse.startPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const threshold = 10;

      const bodies = Matter.Composite.allBodies(engine.world);
      const foundBodies = Matter.Query.point(bodies, endPos);
      let body = null;
      if (foundBodies.length > 0) {
        body = foundBodies[0];
      }

      if (elapsed < 300 && distance < threshold) {        
        if (body && (body as any).todoData) {
          setSelectedTodo((body as any).todoData);
        }
      }

      if (entities.mouse.dragConstraint) {
        Matter.Composite.remove(engine.world, entities.mouse.dragConstraint);
        entities.mouse.dragConstraint = null;
      }
    }
  });

  return entities;
};

//  * Matter 엔진의 모든 body들을 그려줍니다.
const MatterRenderer = ({ engine }: { engine: Matter.Engine }) => {
  // Matter.Composite.allBodies()를 사용해 모든 body들을 얻습니다.
  const bodies = Matter.Composite.allBodies(engine.world);
  const { theme } = useThemeStore();
  // 블록 색상 배열 정의
  const blockColors = theme==='light'?[
    COLORS.blockBlue,
    COLORS.blockOrange,
    COLORS.blockRed,
    COLORS.blockYellow
  ]:[
    COLORS.blockWhite,
    COLORS.blockBlue,
    COLORS.blockOrange,
    COLORS.blockRed,
    COLORS.blockYellow
  ];
  
  return (
    <Svg height={maxHeight} width={maxWidth} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
      {bodies.map((body, index) => {
        const points = body.vertices.map(v => `${v.x},${v.y}`).join(' ');
        // 중심점 계산
        const centerX = body.position.x;
        const centerY = body.position.y;
        
        // 벽이 아닌 경우에만 색상 지정 (정적 바디는 벽)
        const fillColor = body.isStatic 
          ? 'transparent' 
          : blockColors[index % blockColors.length];
        
        return (
          <React.Fragment key={index}>
            <Polygon
              points={points}
              fill={fillColor}
            />
            {/* 벽이 아닌 블록에만 이모지 표시 */}
            {!body.isStatic && (body as any).todoData && (
              <SvgText
                x={centerX}
                y={centerY}
                fontSize="18"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {(body as any).todoData.emoji}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

// useTick 훅은 매 프레임마다 재렌더링을 위한 상태 업데이트를 수행합니다.
const useTick = () => {
  const [tick, setTick] = useState(0);
  const frameRef = useRef<number>();
  
  useEffect(() => {
    let lastTime = 0;
    const targetFPS = 360; // 증가할 수록 더 부드러운 애니메이션
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
   // ToDoStore에서 할 일 목록 가져오기
   const { todos } = useToDoStore();
   // 완료되지 않은 할 일만 필터링

  const uncompletedTodos = React.useMemo(() => todos.filter(todo => !todo.completed), [todos]);
   const [selectedTodo, setSelectedTodo] = useState<ToDoItemType | undefined>(undefined);

   const {
    modalVisible,
    handleOpenModal,
    handleCloseModal,
    handleSaveTodo,
    handleDeleteTodo,
  } = useTodoModal(selectedTodo);

  // Physics 엔진과 월드를 초기화합니다.
  // 매 프레임마다 갱신할 tick 값 (MatterRenderer의 재렌더링 용도)
  const tick = useTick();
  
  // Physics 엔진의 재생성 횟수를 추적하기 위한 키 값
  const [engineKey, setEngineKey] = useState(0);

  const [physics, setPhysics] = useState(() => initPhysics(uncompletedTodos));
  useEffect(() => {
    setPhysics(initPhysics(uncompletedTodos));
    setEngineKey(prevKey => prevKey + 1); // physics가 변경될 때마다 키 값을 증가시킵니다
  }, [uncompletedTodos]);

  // 메모이제이션된 MatterRenderer 컴포넌트
  const memoizedRenderer = React.useMemo(() => (
    <MatterRenderer engine={physics.engine} />
  ), [tick, physics.engine]);

  // 물리 엔진 일시정지 상태 관리
  const [isPaused, setIsPaused] = useState(false);
  
  // 화면이 보이지 않을 때 물리 엔진 일시정지
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState.match(/inactive|background/)) setIsPaused(true); 
      else setIsPaused(false);
    };
    
    // AppState 이벤트 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  // 물리 엔진 업데이트 시스템
  const systems = React.useMemo(() => {
    return [
      PhysicsUpdate, 
      (entities: any, args: any) => TouchHandler(entities, { ...args, setSelectedTodo })
    ];
  }, []);
useEffect(() => {
  if(selectedTodo){
    handleOpenModal();
  }
}, [selectedTodo]);
  return (
    <View style={{ flex: 1 }}>
       {/* 버튼 영역 */}
       <View className={`flex-row w-full absolute top-[20px] left-0 px-px z-[${BubbleButtonZLevel}]`}>
            <BubbleButton variant='list' onPressIn={() => router.push({
              pathname: '/Menu',
              params: { MenuType: 'ToDo' }
            })} />
            <View className='w-[20px]'/>
            <BubbleButton variant='setting' onPressIn={() => router.push({
              pathname: '/Menu',
              params: { MenuType: 'Setting' }
            })}/>
      </View>
      <GameEngine
        key={engineKey} // 고유 키를 추가하여 physics가 변경될 때마다 컴포넌트가 다시 마운트되도록 합니다
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
        systems={systems}
        entities={{
          physics: { engine: physics.engine, world: physics.world },
        }}
        running={!isPaused} // isPaused 상태에 따라 엔진 업데이트를 제어합니다.

        onEvent={(event: any) => {
          console.log("onEvent", event);
        }}  
      />
      {/* 메모이제이션된 렌더러 사용 */}
      {memoizedRenderer}

      {modalVisible && selectedTodo && (
        <TodoDetailModal
          visible={modalVisible}
          onClose={handleCloseModal}
          todo={selectedTodo}
          isCompleted={selectedTodo.completed}
          onSave={handleSaveTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </View>
  );
}