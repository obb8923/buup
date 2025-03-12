
export type ThemeType = 'light' | 'dark' | 'ToyDo';

export type ThemeState = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};