import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">รายงาน</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            สรุปจำนวนงานบริการประจำปี
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="outlined" startIcon={<FileDownloadIcon />}>
            Export PDF
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />}>
            Export Excel
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
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

      {loading && <Alert severity="info">กำลังโหลดรายงาน...</Alert>}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, minHeight: 380 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">จำนวนงานต่อเดือน</Typography>
          <Typography variant="body2" color="text.secondary">
            ใช้ตรวจแนวโน้มปริมาณงานและวางแผนกำลังคน
          </Typography>
        </Box>
        <Box sx={{ minHeight: 280 }}>
          <MonthlyStatsChart data={reportData} />
        </Box>
      </Paper>
    </Stack>
  );
};

export default ReportsPage;
