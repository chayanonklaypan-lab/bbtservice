import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeModeContext = createContext(null);

const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#0f766e', dark: '#115e59', light: '#5eead4' },
    secondary: { main: '#2563eb' },
    background: {
      default: mode === 'light' ? '#f5f7fb' : '#101418',
      paper: mode === 'light' ? '#ffffff' : '#182026',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ['Inter', 'Noto Sans Thai', 'Roboto', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 800, backgroundColor: mode === 'light' ? '#f8fafc' : '#121a20' },
      },
    },
  },
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
};
