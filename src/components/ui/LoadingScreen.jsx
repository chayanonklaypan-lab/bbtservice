import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', px: 2 }}>
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>กำลังโหลดข้อมูล...</Typography>
  </Box>
);

export default LoadingScreen;
