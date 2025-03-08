import React from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import Colors from '../../constants/Colors';
import useThemeStore from '../../stores/useThemeStore';
import { BubbleZLevel } from '../../constants/ZLevels';
import BubbleSvg from '../../../assets/svgs/Bubble1';
import { BubbleConstant as BC } from '../../constants/bubbleConstant';


export interface BubbleButtonProps {
 variant: 'list' | 'setting'|'refresh';
    onPressIn: () => void;
}   

const BubbleButton = ({variant, onPressIn}: BubbleButtonProps) => {
  const { theme } = useThemeStore();

  return (
      <TouchableOpacity
        onPressIn={onPressIn}
        style={{
          width: BC.size * 2,
          height: BC.size * 2,
          zIndex: BubbleZLevel,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
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
              <BubbleSvg width={BC.size * 2} height={BC.size * 2} />
            </View>
          ) : (
            // light 또는 dark 테마일 때 단순한 원 표시
            <View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: BC.size ,
              borderWidth: 1,
              borderColor: theme === 'light' ? Colors.black : Colors.white,
              backgroundColor: 'transparent'
            }} />
          )}
          
            {/* 이모지 텍스트 */}
           
            <Text style={{ 
            color: Colors.black, 
            fontSize: BC.size / 2.5,
            zIndex: 1 
          }}>
            {variant === 'list' ? '📝' : variant === 'setting' ? '⚙️' : '🔄'}
          </Text>
      </TouchableOpacity>
     
  );
};

export default BubbleButton;
