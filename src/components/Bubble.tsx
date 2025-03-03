import React from 'react';
import { View } from 'react-native';
import  Colors  from '../constants/Colors';
import  Text  from './Txt';
import { BubbleConstant as BC} from '../constants/bubbleConstant';
import  useThemeStore  from '../stores/useThemeStore';
import { BubbleProps } from '../types/component/BubbleProps';


const Bubble = (props: BubbleProps) => {
  const { body, position, angle } = props;
  const { theme } = useThemeStore();
  // Matter.js의 원은 반지름으로 정의되지만, 
  // 시각적 표현은 지름으로 해야 함
  const width = BC.size * 2;
  const height = BC.size * 2;
  
  // position이 제공되면 사용하고, 아니면 body에서 가져옴
  const x = position ? position[0] : body.position.x;
  const y = position ? position[1] : body.position.y;
  
  // 회전 각도 (라디안)
  const rotation = angle || body.angle;

  // 테마에 따른 스타일 설정
  const getBubbleStyle = () => {
    switch(theme) {
      case 'buup':
        // buup 테마: 현재 디자인 유지
        return {
          borderColor: Colors.white,
          backgroundColor: Colors.bubbleShadow,
        };
      case 'light':
        // light 테마: 검정 테두리에 투명 배경
        return {
          borderColor: Colors.black,
          backgroundColor: 'transparent',
        };
      case 'dark':
        // dark 테마: 하얀 테두리에 투명 배경
        return {
          borderColor: Colors.white,
          backgroundColor: 'transparent',
        };
      default:
        // 기본 스타일
        return {
          borderColor: Colors.white,
          backgroundColor: Colors.bubbleShadow,
        };
    }
  };

  const bubbleStyle = getBubbleStyle();

  return (
    <View
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width: width,
        height: height,
        borderRadius: width / 2,
        transform: [{ rotate: `${rotation}rad` }],
        borderWidth: 1,
        borderColor: bubbleStyle.borderColor,
        backgroundColor: bubbleStyle.backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: Colors.black }}>o</Text>
    </View>
  );
};

export default Bubble;
