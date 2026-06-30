import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import appRoutes from '../../constants/appRoutes';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(appRoutes.dashboard, { replace: true });
    }, 350);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: 4, textAlign: 'center' }}>
        <CircularProgress size={36} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          ระบบบริหารงานบริการสาธารณสุข
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          กำลังเข้าสู่ระบบ...
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
