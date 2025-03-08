import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import BG from '../src/components/BG';
// 컴포넌트 임포트
import Bubble from '../src/components/Bubble';
// 분리된 함수와 타입 임포트
import { setupEntities, resetAnimation, Entities } from '../src/libs/funcs/animation';
import useToDoStore from '../src/stores/useToDoStore';
import BubbleButton from '../src/components/buttons/BubbleButton';
import { BubbleButtonZLevel } from '../src/constants/ZLevels';
import { router } from 'expo-router';


const App = () => {
  // ToDoStore에서 할 일 목록 가져오기
  const { todos } = useToDoStore();
  // 완료되지 않은 할 일만 필터링
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  // 엔티티 상태 초기화 - 완료되지 않은 할 일만 전달
  const [entities, setEntities] = useState<Entities | null>(() => setupEntities(Bubble, uncompletedTodos));
  const [shouldReset, setShouldReset] = useState(false); // 애니메이션 리셋을 위한 boolean 상태

  // todos가 변경될 때마다 엔티티 업데이트
  useEffect(() => {
    // 완료되지 않은 할 일만 전달
    resetAnimation(setEntities, setShouldReset, Bubble, uncompletedTodos);
  }, [todos]);

  return (
    <BG>
      {/* 버블 렌더링 */}
      {entities ? (
        <View style={{ flex: 1, zIndex: 2 }} key={`main-${shouldReset}`}>
          {/* 버블 렌더링 */}
          {entities.bubbles.map((bubble) => (
            <Bubble 
              key={bubble.id}
              id={bubble.id}
              targetPosition={bubble.targetPosition}
              todoData={bubble.todoData}
            />
          ))}
        </View>
      ) : null}
     
      {/* 버튼 렌더링 */}
      <View className={`flex-row w-full absolute bottom-[20px] left-0 px-px z-[${BubbleButtonZLevel}]`}>
       

            <BubbleButton variant='refresh' onPressIn={() => resetAnimation(setEntities, setShouldReset, Bubble, uncompletedTodos)} />
            <View className='w-[20px]'/>
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
    </BG>
  );
};


export default App;


