import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import {
  ThemeModeContext,
  type ThemeMode,
  type ThemeModeContextValue,
} from './themeModeContext';

const STORAGE_KEY = 'psv-hub:theme-mode';

function readStoredMode(): ThemeMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>(
    () => readStoredMode() ?? (prefersDark ? 'dark' : 'light'),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          secondary: { main: '#7e57c2' },
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontSize: '2rem', fontWeight: 600 },
          h2: { fontSize: '1.6rem', fontWeight: 600 },
          h3: { fontSize: '1.3rem', fontWeight: 600 },
        },
      }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
