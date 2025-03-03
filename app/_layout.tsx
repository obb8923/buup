import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 스플래시 스크린이 자동으로 숨겨지는 것을 방지
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, error] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'MusticaPro-Medium': require('../assets/fonts/MusticaPro-Medium.otf'),
    'MusticaPro-Regular': require('../assets/fonts/MusticaPro-Regular.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: '홈' ,headerShown: false}}/>
        <Stack.Screen name="Menu" options={{ headerTitle: '메뉴' ,headerShown: false}}/>
      </Stack>
    </GestureHandlerRootView>
  );
}

