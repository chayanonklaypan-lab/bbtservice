import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import RequestCalendar from '../../components/calendar/RequestCalendar';

const CalendarPage = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h4">ปฏิทินงานบริการ</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        ดูกำหนดการให้บริการแบบรายเดือน รายสัปดาห์ และรายวัน
      </Typography>
    </Box>
    <RequestCalendar />
  </Stack>
);

export default CalendarPage;
