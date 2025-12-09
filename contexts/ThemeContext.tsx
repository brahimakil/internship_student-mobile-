import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Theme, ThemeMode } from '@/types';
import { lightTheme, darkTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  // Listen to system theme changes
  useEffect(() => {
    if (systemColorScheme) {
      setThemeModeState(systemColorScheme);
    }
  }, [systemColorScheme]);

  const value = useMemo(
    () => ({ theme, themeMode, toggleTheme, setThemeMode }),
    [theme, themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
