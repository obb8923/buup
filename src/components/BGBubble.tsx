import { View, StyleProp, ViewStyle, Animated } from "react-native";
import Colors from "../constants/Colors";
import React, { useEffect, useRef } from "react";
import { BackgroundZLevel } from "../constants/ZLevels";
interface BGBubbleProps {
  style?: StyleProp<ViewStyle>;
  variant?: "mini" | "miniMini";
  point?: number[];
  initialOpacity?: number;
}

const BGBubble = ({ style, variant = "mini", point, initialOpacity }: BGBubbleProps) => {
  // 버블 크기를 variant에 따라 결정
  let bubbleSize=variant==="mini"?5:3;
//   if (variant === "mini") {
//     bubbleSize = Math.floor(Math.random() * 10) + 1; // 1~10 사이의 랜덤 정수 생성
//   } else if (variant === "miniMini") {
//     bubbleSize = Math.floor(Math.random() * 5) + 1; // 1~5 사이의 랜덤 정수 생성
//   }
  
  // Animated.Value로 투명도 상태 관리 (초기 투명도 설정 가능)
  const randomInitialOpacity = useRef(Math.random() * 0.8 + 0.2).current; // 0.2~1.0 사이 랜덤값
  const opacityAnim = useRef(new Animated.Value(initialOpacity || randomInitialOpacity)).current;
  const [increasing, setIncreasing] = React.useState(initialOpacity ? initialOpacity < 0.6 : randomInitialOpacity < 0.6);
  
  useEffect(() => {
    // 애니메이션 시퀀스 생성
    const startAnimation = () => {
      // 목표 투명도 값 (0.2 ~ 1.0 사이)
      const toValue = increasing ? 1.0 : 0.2;
      
      Animated.timing(opacityAnim, {
        toValue,
        duration: 1500, // 1.5초 동안 애니메이션 진행
        useNativeDriver: true, // 네이티브 드라이버 사용으로 성능 향상
      }).start(({ finished }) => {
        // 애니메이션 완료 후 방향 전환
        if (finished) {
          setIncreasing(!increasing);
        }
      });
    };
    
    startAnimation();
  }, [increasing, opacityAnim]);
  
  return (
    <Animated.View
      style={[
        {
          zIndex: BackgroundZLevel,
          position: 'absolute',
          width: bubbleSize,
          height: bubbleSize,
          left: point?point[0]:0,
          top: point?point[1]:0,
          borderRadius: bubbleSize / 2,
          borderWidth: variant === "miniMini" ? 0.5 : 1,
          borderColor: Colors.pattern,
          opacity: opacityAnim, // Animated.Value 사용
        },
        style, // 외부에서 전달받은 스타일 적용
      ]}
    />
  );
};

export default BGBubble;
