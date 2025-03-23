// src/components/ThemeProvider.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../types/type';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.chat.theme);

  useEffect(() => {
    // Apply theme to document.documentElement
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;