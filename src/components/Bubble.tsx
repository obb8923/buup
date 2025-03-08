import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import Colors from '../constants/Colors';
import Text from './Txt';
import { BubbleConstant as BC} from '../constants/bubbleConstant';
import useThemeStore from '../stores/useThemeStore';
import { MotiView } from 'moti';
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { ToDoItemType } from '../stores/useToDoStore';
import TodoDetailModal from './modals/TodoDetailModal';
import useToDoStore from '../stores/useToDoStore';
import { BubbleZLevel } from '../constants/ZLevels';
import useTodoModal from '../libs/hooks/useTodoModal';
// SVG 컴포넌트 임포트 (.tsx 확장자 제거)
import BubbleSvg from '../../assets/svgs/Bubble1';

// 새로운 타입 정의: Matter.js 종속성 제거
export interface BubbleProps {
  id: string;
  position?: [number, number]; // 좌표 (x, y)
  targetPosition: [number, number]; // 목표 좌표
  size?: number;
  todoData?: ToDoItemType; // 할 일 데이터 추가
}

const Bubble = ({id, position, targetPosition, size, todoData}: BubbleProps) => {
  const { theme } = useThemeStore();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // TodoStore에서 필요한 함수들 가져오기
  const { toggleTodo, editTodoContent, removeTodo } = useToDoStore();
  
  // useTodoModal 훅 사용
  const {
    modalVisible,
    handleOpenModal,
    handleCloseModal,
    handleToggleTodo,
    handleSaveTodo,
    handleDeleteTodo
  } = useTodoModal(todoData);
  
  // 랜덤 크기 생성 (size가 제공되지 않은 경우)
  const bubbleSize = useMemo(() => {
    if (size) return size;
    // 최소/최대 크기 차이가 줄어들었으므로 랜덤 범위도 조정
    return BC.minSize + Math.random() * (BC.maxSize - BC.minSize);
  }, [size]);
  
  // 크기 계산 (반지름 x 2)
  const width = bubbleSize * 2;
  const height = bubbleSize * 2;
  
  // 시작 위치 (화면 바깥에서 시작)
  // 무작위로 화면 하단 바깥에서 시작
  const randomOffset = Math.random() * 40 - 20; // -20에서 20 사이의 랜덤 값으로 줄임
  const startX = position ? position[0] : targetPosition[0] + randomOffset;
  const startY = position ? position[1] : screenHeight + 50; // 화면 아래 바깥에서 시작
  
  // 좌우 움직임을 위한 랜덤 진폭 생성 (더 작은 범위로 조정)
  const smallAmplitude = 1 + Math.random() * 1.5; // 1-2.5 사이의 작은 진폭
  
  // 크기에 따른 속도 계산 (작은 버블이 더 빠르게 움직임)
  // 크기 차이가 줄었으므로 속도 차이도 줄임
  const speedFactor = 1 - ((bubbleSize - BC.minSize) / (BC.maxSize - BC.minSize)) * 0.3;
  const duration = (3000 + Math.random() * 2000) / speedFactor;
  
  // 버블 클릭 핸들러
  const handleBubblePress = () => {
    if (todoData) {
      console.log(`Bubble pressed: ${todoData.id} - ${todoData.content}`);
      handleOpenModal(); // 커스텀 훅의 함수 사용
    } else {
      console.log('Bubble pressed but no todoData');
      Alert.alert('알림', '할 일 데이터가 없습니다.');
    }
  };
  
  return (
    <>
      <TouchableOpacity
        onPressIn={handleBubblePress}
        style={{
          position: 'absolute',
          width: width,
          height: height,
          zIndex: BubbleZLevel,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <MotiView
          from={{
            translateX: startX - width / 2,
            translateY: startY - height / 2,
            opacity: 0.7,
            scale: BC.startScale,
          }}
          animate={{
            translateX: [
              startX - width / 2,
              startX - width / 2 - smallAmplitude,
              startX - width / 2 + smallAmplitude,
              startX - width / 2 - smallAmplitude / 2,
              startX - width / 2 + smallAmplitude / 2,
              targetPosition[0] - width / 2,
            ],
            translateY: targetPosition[1] - height / 2,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: duration,
            translateX: {
              type: 'timing',
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              repeat: 3,
              repeatReverse: true,
            },
            translateY: {
              type: 'timing',
              delay: 100 * Math.random(),
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
            scale: {
              type: 'timing',
              duration: duration,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
          }}
          style={{
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* 테마에 따라 다른 배경 적용 */}
          {theme === 'buup' ? (
            // buup 테마일 때 BubbleSvg 사용
            <View style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <BubbleSvg width={width} height={height} />
            </View>
          ) : (
            // light 또는 dark 테마일 때 단순한 원 표시
            <View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: width / 2,
              borderWidth: 1,
              borderColor: theme === 'light' ? Colors.black : Colors.white,
              backgroundColor: 'transparent'
            }} />
          )}
          
          {/* 이모지 텍스트 */}
          <Text style={{ 
            color: Colors.black, 
            fontSize: bubbleSize / 2.5,
            zIndex: 1 
          }}>
            {todoData?.emoji || '📝'}
          </Text>
        </MotiView>
      </TouchableOpacity>
      <View className='absolute bottom-0 left-0 right-0 top-0'>
      {/* 할 일 세부 정보 모달 */}
      {todoData && (
        <TodoDetailModal
          visible={modalVisible}
          onClose={handleCloseModal}
          todo={todoData}
          onDelete={handleDeleteTodo}
          isCompleted={todoData.completed}
          onToggleComplete={handleToggleTodo}
          onSave={handleSaveTodo}
        />
      )}
      </View>
    </>
  );
};

export default Bubble;
