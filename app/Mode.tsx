// import React, { useRef, useEffect } from 'react';
// import { Dimensions, View, PanResponder, AppState } from 'react-native';
// import { GLView } from 'expo-gl';
// import Expo2dContext from 'expo-2d-context';
// import Matter from 'matter-js';

// const { width: ViewWidth, height: ViewHeight } = Dimensions.get('window');

// // 물리 엔진 타입 정의
// interface Physics {
//   engine: Matter.Engine;
//   world: Matter.World;
//   dragConstraint?: Matter.Constraint | null;
// }

// //* Matter.js 물리 엔진과 월드를 초기화하는 함수
// const initPhysics = (width: number, height: number) => {
//   const engine = Matter.Engine.create({
//     enableSleeping: true,
//     positionIterations: 6,  // 10에서 6으로 조정 (너무 높으면 성능 저하, 너무 낮으면 부정확)
//     velocityIterations: 4,  // 10에서 4로 조정 (적절한 균형점)
//   });
//   const world = engine.world;

//   // 물리 객체 스택 생성
//   const stack = Matter.Composites.stack(20, 20, 4, 4, 0, 0, (x: number, y: number) => {
//     const sides = Math.round(Matter.Common.random(1, 8));
//     const chamfer = { radius: 10 };
//     // if (sides > 2 && Matter.Common.random() > 0.7) chamfer = { radius: 10 };
//     const randomCase = Math.round(Matter.Common.random(0, 1));

//     if (randomCase === 0) {
//       if (Matter.Common.random() < 0.8) {
//         return Matter.Bodies.rectangle(
//           x,
//           y,
//           Matter.Common.random(50, 100),
//           Matter.Common.random(50, 100),
//           { chamfer}
//         );
//       } else {
//         return Matter.Bodies.rectangle(
//           x,
//           y,
//           Matter.Common.random(160, 240),
//           Matter.Common.random(50, 60),
//           { chamfer}
//         );
//       }
//     } else {
//       return Matter.Bodies.polygon(
//         x,
//         y,
//         sides,
//         Matter.Common.random(50, 100),
//         { chamfer}
//       );
//     }
//   });
//   Matter.Composite.add(world, stack);

//   // 경계벽 생성
//   const wallThickness = 50;
//   const walls = [
//     Matter.Bodies.rectangle(
//         width / 2,                     // 실제 버퍼 너비 사용
//         height + wallThickness / 2,    // 실제 버퍼 높이 사용
//         width,
//         wallThickness,
//         { isStatic: true }
//       )
//       ,
//       Matter.Bodies.rectangle(
//         width / 2,                      // x 위치 (화면 중앙)
//         -wallThickness / 2,                // y 위치 (화면 위쪽)
//         width,                          // 너비 (화면 너비와 동일)
//         wallThickness,                     // 높이 (벽 두께)
//         { isStatic: true }                 // 고정된 물체로 설정
//       )
//       ,
//       Matter.Bodies.rectangle(
//         -wallThickness / 2,                // x 위치 (화면 왼쪽)
//         height / 2,                     // y 위치 (화면 중앙)
//         wallThickness,                     // 너비 (벽 두께)
//         height,                         // 높이 (화면 높이와 동일)
//         { isStatic: true }                 // 고정된 물체로 설정
//       )
//       ,
//       Matter.Bodies.rectangle(
//         width + wallThickness / 2,      // x 위치 (화면 오른쪽)
//         height / 2,                     // y 위치 (화면 중앙)
//         wallThickness,                     // 너비 (벽 두께)
//         height,                         // 높이 (화면 높이와 동일)
//         { isStatic: true }                 // 고정된 물체로 설정
//       )
//       ];
  
//   Matter.Composite.add(world, walls);

//   return { engine, world };
// };

// //* Expo2dContext를 사용하여 Matter.js 물리 객체를 렌더링하는 컴포넌트
// const Mode = () => {
//   // 물리 엔진 참조를 위한 ref 생성 (초기화는 나중에)
//   const physicsRef = useRef<Physics | null>(null);
//   const glContextRef = useRef(null);
//   const isPausedRef = useRef(false);
//   const fixedTimeStep = 1000 / 120;  // 120fps에 맞춘 고정 시간 간격 (8.33ms)
//   const interpolationRef = useRef(0);  // 보간 값을 저장하기 위한 참조

//   // 앱 상태 변화에 따라 물리 엔진을 일시정지 처리
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: string) => {
//       if (nextAppState.match(/inactive|background/)) {
//         isPausedRef.current = true;
//       } else {
//         isPausedRef.current = false;
//       }
//     };
//     const subscription = AppState.addEventListener('change', handleAppStateChange);
//     return () => subscription.remove();
//   }, []);

//   // 터치 이벤트(PanResponder)를 통해 물리 객체 드래그 기능 구현
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: (evt) => {
//         const pos = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
        
//         // physicsRef.current가 null이 아닌지 확인
//         if (!physicsRef.current) return;
        
//         // 타입 단언을 사용하여 TypeScript에게 physicsRef.current의 타입을 알려줌
//         const physics = physicsRef.current as Physics;
        
//         const bodies = Matter.Composite.allBodies(physics.world);
//         const foundBodies = Matter.Query.point(bodies, pos);
//         if (foundBodies.length > 0) {
//           const body = foundBodies[0];
//           const constraint = Matter.Constraint.create({
//             pointA: pos,
//             bodyB: body,
//             pointB: { x: 0, y: 0 },
//             stiffness: 0.1,
//             damping: 0.1,
//           });
//           Matter.Composite.add(physics.world, constraint);
//           physics.dragConstraint = constraint;
//         }
//       },
//       onPanResponderMove: (evt) => {
//         if (!physicsRef.current) return;
//         const physics = physicsRef.current as Physics;
        
//         if (physics.dragConstraint) {
//           physics.dragConstraint.pointA = {
//             x: evt.nativeEvent.pageX,
//             y: evt.nativeEvent.pageY,
//           };
//         }
//       },
//       onPanResponderRelease: () => {
//         if (!physicsRef.current) return;
//         const physics = physicsRef.current as Physics;
        
//         if (physics.dragConstraint) {
//           Matter.Composite.remove(physics.world, physics.dragConstraint);
//           physics.dragConstraint = undefined;
//         }
//       },
//       onPanResponderTerminate: () => {
//         if (!physicsRef.current) return;
//         const physics = physicsRef.current as Physics;
        
//         if (physics.dragConstraint) {
//           Matter.Composite.remove(physics.world, physics.dragConstraint);
//           physics.dragConstraint = undefined;
//         }
//       },
//     })
//   ).current;

//  //   * WebGL 컨텍스트를 초기화하고 렌더링 루프를 설정합니다.
//   const onContextCreate = async (gl: any) => {
//     // 실제 그리기 버퍼 크기 가져오기
//     const actualWidth = gl.drawingBufferWidth;
//     const actualHeight = gl.drawingBufferHeight;
    
//     // 이제 정확한 크기로 물리 엔진 초기화
//     if (!physicsRef.current) physicsRef.current = initPhysics(actualWidth, actualHeight);
    
//     // Expo2dContext 인스턴스 생성 - 2D 그래픽 렌더링을 위한 캔버스 컨텍스트 ViewWidth, ViewHeight를 사용하여 화면 크기에 맞게 설정
//     const ctx = new Expo2dContext(gl, { ViewWidth, ViewHeight } as any);
//     // 생성된 컨텍스트를 참조 변수에 저장하여 컴포넌트 내에서 접근 가능하게 함
//     glContextRef.current = ctx as any;
    
//     let lastTime = 0;
//     let accumulator = 0;  // 물리 시뮬레이션 시간 누적기
    
//     // 이전 상태와 현재 상태를 저장하기 위한 객체
//     const stateHistory = {
//       previous: new Map(),
//       current: new Map()
//     };

//     const render = (time: number) => {
//       // 첫 프레임인 경우 lastTime 초기화
//       if (!lastTime) lastTime = time;
      
//       // 이전 프레임과의 시간 차이 계산 (물리 엔진 업데이트에 사용)
//       const delta = Math.min(time - lastTime, 32);  // 최대 32ms로 제한하여 큰 시간 차이 방지
//       lastTime = time;
      
//       // 앱이 백그라운드 상태가 아닌 경우에만 물리 엔진 업데이트
//       if (!isPausedRef.current && physicsRef.current) {
//         const physics = physicsRef.current as Physics;
        
//         // 현재 상태를 이전 상태로 복사
//         stateHistory.previous.clear();
//         physics.world.bodies.forEach(body => {
//           if (!body.isStatic) {
//             stateHistory.previous.set(body.id, {
//               position: { ...body.position },
//               angle: body.angle
//             });
//           }
//         });
        
//         // 고정 시간 간격으로 물리 업데이트 (더 안정적인 시뮬레이션)
//         accumulator += delta;
//         let updated = false;
        
//         while (accumulator >= fixedTimeStep) {
//           Matter.Engine.update(physics.engine, fixedTimeStep);
//           accumulator -= fixedTimeStep;
//           updated = true;
//         }
        
//         // 물리 업데이트가 있었을 경우에만 현재 상태 저장
//         if (updated) {
//           stateHistory.current.clear();
//           physics.world.bodies.forEach(body => {
//             if (!body.isStatic) {
//               stateHistory.current.set(body.id, {
//                 position: { ...body.position },
//                 angle: body.angle
//               });
//             }
//           });
//         }
        
//         // 보간 계수 계산 (0과 1 사이의 값)
//         interpolationRef.current = accumulator / fixedTimeStep;
        
//         // 캔버스 초기화 - 흰색 배경으로 화면 지우기
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        
//         // 화면에 보이는 물체만 렌더링하는 최적화
//         const bodies = Matter.Composite.allBodies(physics.world);
//         const visibleBodies = bodies.filter(body => {
//           // 화면 밖으로 약간 확장된 영역 내에 있는 물체만 렌더링
//           const padding = 100;
//           return (
//             body.position.x > -padding &&
//             body.position.x < gl.drawingBufferWidth + padding &&
//             body.position.y > -padding &&
//             body.position.y < gl.drawingBufferHeight + padding
//           );
//         });
        
//         // 보이는 물체만 렌더링
//         visibleBodies.forEach((body) => {
//           // 물체에 정점(vertices)이 있는 경우에만 그리기
//           if (body.vertices.length > 0) {
//             // 새로운 경로 시작
//             ctx.beginPath();
            
//             // 정적 물체는 보간 없이 그대로 그리기
//             if (body.isStatic) {
//               const first = body.vertices[0];
//               ctx.moveTo(first.x, first.y);
              
//               for (let i = 1; i < body.vertices.length; i++) {
//                 const vertex = body.vertices[i];
//                 ctx.lineTo(vertex.x, vertex.y);
//               }
//             } 
//             // 동적 물체는 이전 상태와 현재 상태 사이를 보간하여 그리기
//             else {
//               const prevState = stateHistory.previous.get(body.id);
//               const currState = stateHistory.current.get(body.id);
              
//               if (prevState && currState) {
//                 const alpha = interpolationRef.current;
                
//                 // 위치와 각도 보간
//                 const interpolatedPos = {
//                   x: prevState.position.x + (currState.position.x - prevState.position.x) * alpha,
//                   y: prevState.position.y + (currState.position.y - prevState.position.y) * alpha
//                 };
//                 const interpolatedAngle = prevState.angle + (currState.angle - prevState.angle) * alpha;
                
//                 // 보간된 위치와 각도로 정점 계산
//                 const vertices = body.vertices.map(vertex => {
//                   // 물체 중심을 기준으로 한 상대 위치 계산
//                   const relX = vertex.x - body.position.x;
//                   const relY = vertex.y - body.position.y;
                  
//                   // 현재 각도와 보간된 각도의 차이만큼 회전
//                   const angleDiff = interpolatedAngle - body.angle;
//                   const cos = Math.cos(angleDiff);
//                   const sin = Math.sin(angleDiff);
                  
//                   // 회전 변환 적용
//                   const rotatedX = relX * cos - relY * sin;
//                   const rotatedY = relX * sin + relY * cos;
                  
//                   // 보간된 위치로 이동
//                   return {
//                     x: interpolatedPos.x + rotatedX,
//                     y: interpolatedPos.y + rotatedY
//                   };
//                 });
                
//                 // 보간된 정점으로 경로 그리기
//                 ctx.moveTo(vertices[0].x, vertices[0].y);
//                 for (let i = 1; i < vertices.length; i++) {
//                   ctx.lineTo(vertices[i].x, vertices[i].y);
//                 }
//               } else {
//                 // 이전/현재 상태가 없으면 일반적인 방식으로 그리기
//                 const first = body.vertices[0];
//                 ctx.moveTo(first.x, first.y);
                
//                 for (let i = 1; i < body.vertices.length; i++) {
//                   const vertex = body.vertices[i];
//                   ctx.lineTo(vertex.x, vertex.y);
//                 }
//               }
//             }
            
//             // 경로 닫기 (첫 정점과 마지막 정점 연결)
//             ctx.closePath();
            
//             // 내부 채우기: 파란색 반투명 색상 적용
//             ctx.fillStyle = 'rgba(0,255,255,0.5)';
//             ctx.fill();
//           }
//         });
//       }

//       // 현재 프레임 렌더링 완료 표시 (Expo GL 전용 메서드)
//       gl.endFrameEXP();
      
//       // 다음 애니메이션 프레임 요청 (렌더링 루프 유지)
//       requestAnimationFrame(render);
//     };

//     // 최초 렌더링 루프 시작
//     requestAnimationFrame(render);
//   };

//   return (
//     <View style={{ flex: 1 , backgroundColor: '#d1d1d1'}} {...panResponder.panHandlers}>
//       <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
//     </View>
//   );
// };
// export default Mode;