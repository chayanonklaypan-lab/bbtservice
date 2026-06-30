import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => (
  <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom>
      404
    </Typography>
    <Typography variant="h6" gutterBottom>
      ไม่พบหน้าที่ต้องการ
    </Typography>
    <Box sx={{ mt: 4 }}>
      <Button component={RouterLink} to="/" variant="contained">
        กลับหน้าหลัก
      </Button>
    </Box>
  </Container>
);

export default NotFoundPage;
