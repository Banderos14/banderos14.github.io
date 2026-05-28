import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored === 'light' || stored === 'dark') ? stored : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggle };
}
