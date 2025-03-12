import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ModeType = 'bubble' | 'block';

interface ModeState {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

const useModeStore = create<ModeState>((set) => ({
  mode: 'bubble',
  setMode: async (mode: ModeType) => {
    try {
      await AsyncStorage.setItem('@ToyDo:mode', mode);
      set({ mode });
    } catch (error) {
      console.error('모드 저장 중 오류 발생:', error);
    }
  },
}));

// 초기 모드 불러오기
AsyncStorage.getItem('@ToyDo:mode')
  .then((savedMode) => {
    if (savedMode && (savedMode === 'bubble' || savedMode === 'block')) {
      useModeStore.getState().setMode(savedMode);
    }
  })
  .catch((error) => {
    console.error('저장된 모드 불러오기 실패:', error);
  });

export default useModeStore;
