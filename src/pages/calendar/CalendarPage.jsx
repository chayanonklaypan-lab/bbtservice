import React from 'react';
import { Container, Typography } from '@mui/material';
import RequestCalendar from '../../components/calendar/RequestCalendar';

const CalendarPage = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>
      ปฏิทินงานบริการ
    </Typography>
    <RequestCalendar />
  </Container>
);

export default CalendarPage;
