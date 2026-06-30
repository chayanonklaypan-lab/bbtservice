import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import requestTypes from '../../constants/requestTypes';
import requestStatus from '../../constants/status';

const SearchFilterPanel = ({ filters, onChange, onReset }) => {
  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            ค้นหาและกรอง
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ค้นด้วยเลขคำร้อง ชื่อผู้แจ้ง หรือเบอร์โทร
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ xs: 'stretch', lg: 'center' }}>
          <TextField
            label="ค้นหา"
            value={filters.search || ''}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            fullWidth
          />
          <FormControl fullWidth sx={{ minWidth: { lg: 220 } }}>
            <InputLabel>ประเภทงาน</InputLabel>
            <Select
              label="ประเภทงาน"
              value={filters.requestType || ''}
              onChange={(event) => onChange({ ...filters, requestType: event.target.value })}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {Object.values(requestTypes).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ minWidth: { lg: 180 } }}>
            <InputLabel>สถานะ</InputLabel>
            <Select
              label="สถานะ"
              value={filters.status || ''}
              onChange={(event) => onChange({ ...filters, status: event.target.value })}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {Object.values(requestStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onReset} sx={{ minWidth: 128 }}>
            ล้างกรอง
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SearchFilterPanel;
