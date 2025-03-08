import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupLanguage } from '../src/i18n';

// 스플래시 스크린이 자동으로 숨겨지는 것을 방지
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, error] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    // 'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    // 'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    // 'MusticaPro-Medium': require('../assets/fonts/MusticaPro-Medium.otf'),
    // 'MusticaPro-Regular': require('../assets/fonts/MusticaPro-Regular.otf'),
  });
  
  // i18n 시스템 초기화 상태
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    // 언어 설정 초기화
    setupLanguage()
      .then(() => {
        setI18nInitialized(true);
        console.log('언어 설정이 초기화되었습니다.');
      })
      .catch(error => {
        console.error('언어 설정 초기화 중 오류 발생:', error);
        // 오류가 발생해도 앱은 계속 실행되도록 초기화 완료로 설정
        setI18nInitialized(true);
      });
  }, []);

  useEffect(() => {
    if ((fontsLoaded || error) && i18nInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, i18nInitialized]);

  if ((!fontsLoaded && !error) || !i18nInitialized) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'card',
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: '홈' }}/>
        <Stack.Screen name="Menu" options={{ headerTitle: '메뉴' }}/>
      </Stack>
    </GestureHandlerRootView>
  );
}

