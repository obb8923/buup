// store/themeStore.js
import { create } from 'zustand';
import { ThemeState, ThemeType } from '../types/store/ThemeStoreType';

const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme: ThemeType) => set({ theme }),
}));

export default useThemeStore;
