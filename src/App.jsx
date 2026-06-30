import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './hooks/useNotifications';
import AppRoutes from './routes/AppRoutes';
import SnackbarAlert from './components/ui/SnackbarAlert';

function AppContent() {
  const { settings } = useAppSettings();

  return (
    <BrowserRouter>
      <ThemeModeProvider initialMode={settings.defaultTheme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
            <SnackbarAlert />
          </AuthProvider>
        </NotificationProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppSettingsProvider>
      <AppContent />
    </AppSettingsProvider>
  );
}

export default App;
