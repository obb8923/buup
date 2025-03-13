import React from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import Colors from '../../constants/Colors';
import useThemeStore from '../../stores/useThemeStore';
import { BubbleZLevel } from '../../constants/ZLevels';
import BubbleSvg from '../../../assets/svgs/Bubble1';
import { BubbleConstant as BC } from '../../constants/EntitiesConstants';
import BubbleGradient from '../../../assets/svgs/BubbleGradient';
import useModeStore from '../../stores/useModeStore';
export interface BubbleButtonProps {
 variant: 'list' | 'setting'|'refresh';
    onPressIn: () => void;
}   

const BubbleButton = ({variant, onPressIn}: BubbleButtonProps) => {
  const { theme } = useThemeStore();
  const { mode } = useModeStore();

  // 모드에 따라 다른 버튼 렌더링
  const renderer = ()=>{
    if(mode === 'bubble'){
      return  (<TouchableOpacity
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
        {theme === 'ToyDo' ? (
          // ToyDo 테마일 때 BubbleSvg 사용
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
            backgroundColor: 'transparent'
          }} >
            <BubbleGradient width={BC.size * 2} height={BC.size * 2} />
          </View>
        )}
        
          {/* 이모지 텍스트 */}
         
          <Text style={{ 
          color: Colors.black, 
          fontSize: BC.size / 2.5,
          zIndex: 1 
        }}>
          {variant === 'list' ? '📝' : variant === 'setting' ? '⚙️' : '🔄'}
        </Text>
    </TouchableOpacity>)
    }else{
      return  (<TouchableOpacity
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
      
          {/* variant에 따라 다른 모양 적용 */}
          <View style={{
            position: 'absolute',
            width: variant === 'list' ? '95%' : '100%',
            height: variant==='list'?'95%':'100%',
            borderRadius: BC.size / 3 ,
            backgroundColor: Colors.background1,
            transform: variant === 'list' ? [
              { rotate: '45deg' }
            ] : [],
          }} />
      
          {/* 이모지 텍스트 */}
          <Text style={{ 
          color: Colors.black, 
          fontSize: BC.size / 2.5,
          zIndex: 1 
        }}>
          {variant === 'list' ? '📝' : variant === 'setting' ? '⚙️' : '🔄'}
        </Text>
    </TouchableOpacity>)
    }
  } 
 return renderer();
};

export default BubbleButton;
