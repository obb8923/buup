import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Bubble from '../src/components/Bubble';
import { setupEntities, resetAnimation, Entities } from '../src/libs/funcs/animation';
import useToDoStore from '../src/stores/useToDoStore';
import BubbleButton from '../src/components/buttons/BubbleButton';
import { router } from 'expo-router';
import { BubbleButtonZLevel } from '../src/constants/ZLevels';

const ModeBubble = () => {
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
    <>
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
      {/* 버튼 영역 */}
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
    </>
  );
};

export default ModeBubble; 