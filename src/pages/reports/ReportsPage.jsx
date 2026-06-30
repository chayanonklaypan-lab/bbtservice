import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { getMonthlyReport } from '../../services/reportService';
import SummaryCard from '../../components/cards/SummaryCard';
import MonthlyStatsChart from '../../components/charts/MonthlyStatsChart';

const ReportsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      const data = await getMonthlyReport(new Date().getFullYear());
      setReportData(data);
      setLoading(false);
    };

    loadReport();
  }, []);

  const totalThisYear = reportData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">รายงาน</Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Export PDF
          </Button>
          <Button variant="contained">Export Excel</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <SummaryCard title="ยอดงานปีนี้" value={totalThisYear} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title="เดือนล่าสุด" value={reportData[reportData.length - 1]?.count || 0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title="จำนวนเดือนที่รายงาน" value={reportData.length} />
        </Grid>
      </Grid>

      <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          จำนวนงานต่อเดือน
        </Typography>
        <MonthlyStatsChart data={reportData} />
        {loading && <Typography sx={{ mt: 2 }}>กำลังโหลดรายงาน...</Typography>}
      </Box>
    </Container>
  );
};

export default ReportsPage;
