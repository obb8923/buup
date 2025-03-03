import {View, StatusBar, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors'
import { generatePointsAll } from '../libs/funcs/poissonDiskSampling';
import BGBubble from './BGBubble';
import useThemeStore from '../stores/useThemeStore';
const BG = ({ children}: {children?: React.ReactNode}) => {
  const { theme } = useThemeStore();

  return (
    <SafeAreaView className="flex-1 z-[BackgroundZLevel]">
      <StatusBar
        barStyle={theme==="light"?"dark-content":"light-content"}
        backgroundColor={theme==="buup"?Colors.pattern:theme==="light"?Colors.white:Colors.black}
        translucent={false}
      />
      {theme==="buup"&&
        <LinearGradient
          colors={[Colors.pattern,Colors.background2,Colors.background1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          className="w-full h-full">
            {pattern()}
            {miniBubbles()}
            {miniminiBubbles()}
          {children}
        </LinearGradient>
      }
      {theme==="light"&&
      <View className='flex-1 bg-white'>
        {children}
       </View>
      }
      {theme==="dark"&&
      <View className='flex-1 bg-black'>
        {children}
       </View>
      }
    </SafeAreaView>
  );
};

const pattern = () => {
  const { width, height } = Dimensions.get('window');
  
  return (
    <View style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {Array.from({ length: 20 }).map((_, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            left: Math.random() * width,
            top: Math.random() * height,
            opacity: Math.random() * 0.5 + 0.1,
            transform: [{ rotate: `${Math.random() * 360}deg` }]
          }}
        >
          <View style={{
            backgroundColor: Colors.white,
            width: '100%',
            height: '100%',
            borderRadius: 2
          }} />
        </View>
      ))}
    </View>
  );
};

const miniBubbles = () => {
  const minDistance = 100; 
  const points = generatePointsAll(minDistance);
  
  return points.map((point: number[], index: number) => (
    <BGBubble
      key={`bubble-${index}`}
      variant="mini"
      point={point}
    />
  ));
}

const miniminiBubbles = () => {
  const minDistance = 80; 
  const points = generatePointsAll(minDistance);
  
  return points.map((point: number[], index: number) => (
    <BGBubble
      key={`bubble-${index}`}
      variant="miniMini"
      point={point}
    />
  ));
}

export default BG;
