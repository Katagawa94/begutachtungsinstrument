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
          primary: { main: mode === 'dark' ? '#5b8def' : '#2456d6' },
          secondary: { main: mode === 'dark' ? '#34c2b3' : '#0f8a7e' },
          background:
            mode === 'dark'
              ? { default: '#0f1620', paper: '#18202c' }
              : { default: '#eef2f8', paper: '#ffffff' },
          divider: mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,30,55,0.12)',
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontSize: '2rem', fontWeight: 600 },
          h2: { fontSize: '1.6rem', fontWeight: 600 },
          h3: { fontSize: '1.3rem', fontWeight: 600 },
        },
        components: {
          MuiAppBar: {
            defaultProps: { color: 'primary', enableColorOnDark: true },
            styleOverrides: {
              colorPrimary: {
                backgroundImage:
                  mode === 'dark'
                    ? 'linear-gradient(90deg, #1f3a6b 0%, #2456d6 100%)'
                    : 'linear-gradient(90deg, #1d4fc4 0%, #2c6ae0 100%)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              outlined: ({ theme: t }) => ({
                borderColor: t.palette.divider,
              }),
            },
          },
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
