import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Bubble from '../src/components/Bubble';
import { setupEntities, resetAnimation, Entities } from '../src/libs/funcs/animation';
import useToDoStore from '../src/stores/useToDoStore';
import BubbleButton from '../src/components/buttons/BubbleButton';
import { router } from 'expo-router';
import { BubbleButtonZLevel } from '../src/constants/ZLevels';
import { getMaxPointsCount } from '../src/libs/funcs/poissonDiskSampling';

const ModeBubble = () => {
  // ToDoStore에서 할 일 목록 가져오기
  const { todos } = useToDoStore();
  // 완료되지 않은 할 일만 필터링
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  // 현재 화면에서 생성 가능한 최대 버블 개수
  const maxBubbles = getMaxPointsCount();
  // 엔티티 상태 초기화 - 완료되지 않은 할 일만 전달 (최대 개수 전달)
  const [entities, setEntities] = useState<Entities | null>(() => setupEntities(Bubble, uncompletedTodos, maxBubbles));
  const [shouldReset, setShouldReset] = useState(false); // 애니메이션 리셋을 위한 boolean 상태

  // todos가 변경될 때마다 엔티티 업데이트
  useEffect(() => {
    // 완료되지 않은 할 일만 전달 (최대 개수도 전달)
    resetAnimation(setEntities, setShouldReset, Bubble, uncompletedTodos, maxBubbles);
  }, [todos, maxBubbles]);

  // 표시 중인 버블 개수와 총 할 일 개수
  // const displayedCount = entities?.bubbles.length || 0;
  // const totalCount = uncompletedTodos.length;
  // const isLimited = totalCount > maxBubbles;

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
          
          {/* 버블 분포를 보여주는 빨간 점 */}
          {/* {entities.bubbles.map((bubble) => (
            <View
              key={`dot-${bubble.id}`}
              style={{
                position: 'absolute',
                left: bubble.targetPosition[0] - 4,
                top: bubble.targetPosition[1] - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'red',
                zIndex: 999,
              }}
            />
          ))} */}
        
        </View>
      ) : null}
      {/* 버튼 영역 */}
      <View className={`flex-row w-full absolute bottom-[20px] left-0 px-px z-[${BubbleButtonZLevel}]`}>
            <BubbleButton variant='refresh' onPressIn={() => resetAnimation(setEntities, setShouldReset, Bubble, uncompletedTodos, maxBubbles)} />
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