import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { getRequestById, getTimelineByRequestId, addTimelineEntry, updateRequest } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';
import TimelineList from '../../components/ui/TimelineList';
import requestStatus from '../../constants/status';
import statusColors from '../../constants/statusColors';

const InfoItem = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
      {label}
    </Typography>
    <Typography sx={{ mt: 0.25 }}>{value || '-'}</Typography>
  </Box>
);

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const { showNotification } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestData = await getRequestById(id);
      if (!requestData) {
        setError('ไม่พบคำร้องนี้');
        return;
      }
      const timelineData = await getTimelineByRequestId(id);
      setRequest(requestData);
      setTimeline(timelineData);
      setProgressStatus(requestData.status || '');
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดขณะโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleProgressSubmit = async () => {
    const normalizedProgressMessage = progressMessage.trim();

    if (!normalizedProgressMessage) {
      showNotification('กรุณากรอกข้อความอัปเดต', 'warning');
      return;
    }

    if (!progressStatus) {
      showNotification('กรุณาเลือกสถานะ', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await addTimelineEntry(id, {
        editorName: 'ผู้ใช้ระบบ',
        message: normalizedProgressMessage,
        status: progressStatus,
      });
      await updateRequest(id, { status: progressStatus });
      showNotification('อัปเดตความคืบหน้าเรียบร้อย', 'success');
      setProgressMessage('');
      loadData();
    } catch (err) {
      console.error(err);
      showNotification('ไม่สามารถบันทึกความคืบหน้าได้', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Alert severity="info">กำลังโหลดรายละเอียดคำร้อง...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">รายละเอียดคำร้อง</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            เลขคำร้อง {request.requestId || request.id}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')}>
          กลับ
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="h6">ข้อมูลคำร้อง</Typography>
                <Chip
                  label={request.status || '-'}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: statusColors[request.status] || 'grey.200',
                    color: statusColors[request.status] ? 'white' : 'text.primary',
                  }}
                />
              </Stack>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <InfoItem label="วันที่รับคำร้อง" value={request.receivedDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoItem label="ผู้รับเรื่อง" value={request.assigneeName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoItem label="ชื่อผู้แจ้ง" value={request.requesterName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoItem label="เบอร์โทร" value={request.requesterPhone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoItem label="ประเภทงาน" value={request.requestType} />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem label="รายละเอียด" value={request.description} />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">อัปเดตความคืบหน้า</Typography>
                <Typography variant="body2" color="text.secondary">
                  เปลี่ยนสถานะและบันทึกข้อความลง Timeline
                </Typography>
              </Box>
              <TextField
                select
                fullWidth
                label="เปลี่ยนสถานะ"
                value={progressStatus}
                onChange={(event) => setProgressStatus(event.target.value)}
              >
                {Object.values(requestStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="ข้อความอัปเดต"
                multiline
                minRows={4}
                value={progressMessage}
                onChange={(event) => setProgressMessage(event.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleProgressSubmit} disabled={submitting}>
                  บันทึกลง Timeline
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Timeline
        </Typography>
        <TimelineList entries={timeline} />
      </Box>
    </Stack>
  );
};

export default RequestDetailPage;
