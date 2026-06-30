import React from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';

const RequestForm = ({ onSubmit, defaultValues = {}, loading = false }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        แบบฟอร์มคำร้อง
      </Typography>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="ชื่อผู้แจ้ง" name="requesterName" defaultValue={defaultValues.requesterName || ''} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="เบอร์โทร" name="requesterPhone" defaultValue={defaultValues.requesterPhone || ''} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="รายละเอียด" name="description" defaultValue={defaultValues.description || ''} multiline rows={4} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button type="submit" variant="contained" disabled={loading}>
              บันทึกคำร้อง
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RequestForm;
