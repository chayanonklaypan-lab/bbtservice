import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import appRoutes from '../../constants/appRoutes';
import municipalityLogo from '../../assets/municipality-logo.jpg';

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
        <Box
          component="img"
          src={municipalityLogo}
          alt="เทศบาลนครบางบัวทอง"
          sx={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', mb: 2 }}
        />
        <Typography variant="h5">เทศบาลนครบางบัวทอง</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          ระบบบริหารงานบริการสาธารณสุข
        </Typography>
        <CircularProgress size={32} sx={{ mt: 3 }} />
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          กำลังเข้าสู่ระบบ...
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
