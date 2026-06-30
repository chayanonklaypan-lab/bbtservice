import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
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
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          ภาพรวมงานบริการและสถานะคำร้องล่าสุด
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard title="คำร้องทั้งหมด" value={summary.totalRequests} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard title="งานวันนี้ / รอดำเนินการ" value={summary.pending} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard title="งานเสร็จแล้ว" value={summary.completed} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard title="งานยกเลิก" value={summary.cancelled} />
        </Grid>
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3 },
          minHeight: 380,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">สถิติรายเดือน</Typography>
          <Typography variant="body2" color="text.secondary">
            จำนวนคำร้องที่บันทึกในแต่ละเดือน
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minHeight: 280 }}>
          <MonthlyStatsChart data={summary.byMonth} />
        </Box>
      </Paper>
    </Stack>
  );
};

export default DashboardPage;
