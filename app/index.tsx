import React, { useState, useEffect } from 'react';
import { GameEngine } from 'react-native-game-engine';
import { View } from 'react-native';
import BG from '../src/components/BG';
// 컴포넌트와 시스템 임포트
import Box from '../src/components/Box';
import Bubble from '../src/components/Bubble';
import { Physics } from '../src/systems/Physics';
// 분리된 함수와 타입 임포트
import { setupEntities, resetAnimation, Entities } from '../src/libs/funcs/animation';
import RefreshButton from '../src/components/buttons/RefreshButton';
import MenuButton from '../src/components/buttons/MenuButton';
const App = () => {
  const [running, setRunning] = useState(true);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [bgEngine, setBgEngine] = useState<GameEngine | null>(null);
  
  // 엔티티 상태 초기화
  const [entities, setEntities] = useState<Entities | null>(() => setupEntities(Bubble, Box));
  const [key, setKey] = useState(1); // 애니메이션 리셋을 위한 키 추가

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 필요한 정리 작업 수행
      if (gameEngine ) {
        (gameEngine as any).stop();
      }
      if (bgEngine ) {
        (bgEngine as any).stop();
      }
    };
  }, []);

  return (
    <BG>
      <MenuButton />
      {entities ? (
        <>
          <GameEngine
            key={`main-${key}`}
            ref={(ref) => { setGameEngine(ref) }}
            style={[{flex:1}, {zIndex: 2}]}
            systems={[Physics]}
            entities={entities}
            running={running}
            onEvent={(e: any) => {
              if (e.type === 'game-over') {
                setRunning(false);
              }
            }}
          >
          </GameEngine>
          {/* 새로고침 버튼 추가 */}
         <RefreshButton setEntities={setEntities} setKey={setKey} Bubble={Bubble} Box={Box} resetAnimation={resetAnimation}/>
        </>
      ) : null}
    </BG>
  );
};


export default App;


