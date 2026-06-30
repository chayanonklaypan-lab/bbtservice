import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import SummaryCard from '../../components/cards/SummaryCard';
import MonthlyStatsChart from '../../components/charts/MonthlyStatsChart';
import { getDashboardSummary } from '../../services/dashboardService';

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    totalRequests: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    byMonth: [],
  });

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getDashboardSummary();
      const monthData = Object.entries(data.byMonth).map(([month, count]) => ({ month, count }));
      setSummary({ ...data, byMonth: monthData });
    };

    loadSummary();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="จำนวนคำร้องทั้งหมด" value={summary.totalRequests} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="งานวันนี้" value={summary.pending} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="งานเสร็จแล้ว" value={summary.completed} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="งานยกเลิก" value={summary.cancelled} />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          สถิติรายเดือน
        </Typography>
        <MonthlyStatsChart data={summary.byMonth} />
      </Box>
    </Container>
  );
};

export default DashboardPage;
