import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
    <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: 4, textAlign: 'center' }}>
      <Typography variant="h3">404</Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        ไม่พบหน้าที่ต้องการ
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
        กลับหน้าหลัก
      </Button>
    </Paper>
  </Box>
);

export default NotFoundPage;
