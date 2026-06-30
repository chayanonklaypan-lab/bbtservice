import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotifications } from '../../hooks/useNotifications';

const SnackbarAlert = () => {
  const { notification, hideNotification } = useNotifications();

  if (!notification) {
    return null;
  }

  return (
    <Snackbar open={Boolean(notification)} autoHideDuration={4000} onClose={hideNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={hideNotification} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
