import { TouchableOpacity, View, Animated} from "react-native";
import Txt from "./Txt";
import { useEffect, useRef} from "react";
import { t, getCurrentLanguage } from "../i18n";
import useThemeStore from "../stores/useThemeStore";
interface TextToggleProps {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  onToggle: () => void;
  activeColor?: string;
  inactiveColor?: string;
}
//  텍스트가 있는 토글 컴포넌트
const TextToggle = ({
  isActive,
  activeText,
  inactiveText,
  onToggle,
  activeColor = 'bg-blue-500',
  inactiveColor = 'bg-gray-200',
}: TextToggleProps) => {
  // 현재 언어 가져오기
  const currentLanguage = getCurrentLanguage();
  const isEnglish = currentLanguage === 'en';
  const { theme } = useThemeStore();
  
  // 애니메이션 값 초기화 (isActive 상태에 따라 0 또는 1)
  const animation = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const toggleSize = 20; // 토글 원의 크기
  const fixedWidth = 100; // 토글 컨테이너의 고정 너비

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // 레이아웃 관련 애니메이션이므로 false
    }).start();
  }, [isActive]);

  // 컨테이너 너비에 따라 토글 이동 거리 계산
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [4, fixedWidth - toggleSize - 4], // 양쪽에 4px 패딩 추가
  });

  // 배경색 애니메이션
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor.includes('bg-') ? '#e5e7eb' : inactiveColor, 
                 activeColor.includes('bg-') ? '#3b82f6' : activeColor]
  });

  // 활성화 텍스트 투명도 애니메이션
  const activeTextOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1]
  });

  // 비활성화 텍스트 투명도 애니메이션
  const inactiveTextOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0]
  });

  return (
   
    <View 
    className={``}
    style={{width: fixedWidth}}>
      <TouchableOpacity 
        onPress={onToggle}
        activeOpacity={0.8}
        className={`flex flex-row items-center h-auto ${isEnglish ? 'space-x-1' : 'space-x-2'}`}
        style={{
          width: fixedWidth,
        }}
      >
        {/* 토글 컨테이너 */}
        <View className="flex-row items-center w-full">
          <Animated.View 
            className="relative w-full h-8 rounded-full justify-center px-4 flex-row items-center"
            style={{ 
              backgroundColor,
            }}
          >
         
              {/* 활성화 텍스트 */}
              <Animated.View style={{ opacity: activeTextOpacity }}
              className="absolute left-0 px-2">
                <Txt variant="caption" className={`text-white ${isEnglish ? 'text-[10px]' : ''}`}>
                  {activeText}
                </Txt>
              </Animated.View>
              
              {/* 비활성화 텍스트 */}
              <Animated.View style={{ opacity: inactiveTextOpacity }}
              className="absolute right-0 px-2">
                <Txt variant="caption" className={`text-gray600 ${isEnglish ? 'text-[10px]' : ''}`}>
                  {inactiveText}
                </Txt>
              </Animated.View>
            {/* 토글 핸들 */}
            <Animated.View 
              className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'bg-blue-500 ' 
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}
              style={{ 
                transform: [{ translateX }],
                left: 0 
              }}
            >
              {isActive && (
                <Txt className="text-white text-xs font-bold">✓</Txt>
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </TouchableOpacity>
      </View>
  );
};

export default TextToggle; 