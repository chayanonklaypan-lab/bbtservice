import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './hooks/useNotifications';
import AppRoutes from './routes/AppRoutes';
import SnackbarAlert from './components/ui/SnackbarAlert';

function App() {
  return (
    <BrowserRouter>
      <ThemeModeProvider>
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

export default App;
