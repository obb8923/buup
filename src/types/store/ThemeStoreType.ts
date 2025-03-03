
export type ThemeType = 'light' | 'dark' | 'buup';

export type ThemeState = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};