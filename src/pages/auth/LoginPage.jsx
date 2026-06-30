import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import appRoutes from '../../constants/appRoutes';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to dashboard (no authentication required for shared access)
    const timer = setTimeout(() => {
      navigate(appRoutes.dashboard, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ระบบบริหารงานบริการสาธารณสุข
        </Typography>
        <CircularProgress />
        <Typography variant="body1">
          กำลังเข้าสู่ระบบ...
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
