import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import requestTypes from '../../constants/requestTypes';
import requestStatus from '../../constants/status';

const SearchFilterPanel = ({ filters, onChange, onReset }) => {
  return (
    <Box component="section" sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        ค้นหาและกรอง
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
        <TextField
          label="ค้นหาชื่อผู้แจ้ง, เบอร์โทร, เลขคำร้อง"
          value={filters.search || ''}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
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
        <FormControl fullWidth>
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
        <Button variant="outlined" onClick={onReset} sx={{ whiteSpace: 'nowrap' }}>
          ล้างกรอง
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchFilterPanel;
