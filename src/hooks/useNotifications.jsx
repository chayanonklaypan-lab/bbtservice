import { useCallback, useContext, createContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({ message, severity });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value = useMemo(
    () => ({ notification, showNotification, hideNotification }),
    [notification, showNotification, hideNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
