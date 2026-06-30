import React, { useState } from 'react';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถเข้าสู่ระบบได้ โปรดลองอีกครั้ง');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ระบบบริหารงานบริการสาธารณสุข
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          เข้าสู่ระบบด้วยบัญชี Google เพื่อใช้งานระบบ
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Button variant="contained" size="large" onClick={handleLogin}>
          เข้าสู่ระบบด้วย Google
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
