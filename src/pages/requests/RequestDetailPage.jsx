import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { getRequestById, getTimelineByRequestId, addTimelineEntry, updateRequest } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';
import TimelineList from '../../components/ui/TimelineList';
import requestStatus from '../../constants/status';

const RequestDetailPage = () => {
  const { id } = useParams();
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
    if (!progressMessage.trim()) {
      showNotification('กรุณากรอกข้อความอัปเดต', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await addTimelineEntry(id, {
        editorName: 'ผู้ใช้ระบบ',
        message: progressMessage,
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
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>กำลังโหลดรายละเอียดคำร้อง...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        รายละเอียดคำร้อง
      </Typography>
      <Box sx={{ my: 3, p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          เลขคำร้อง: {request.requestId || request.id}
        </Typography>
        <Typography variant="body2" gutterBottom>
          วันที่รับคำร้อง: {request.receivedDate || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          ผู้รับเรื่อง: {request.assigneeName || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          ชื่อผู้แจ้ง: {request.requesterName || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          เบอร์โทร: {request.requesterPhone || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          ประเภทงาน: {request.requestType || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          สถานะ: {request.status || '-'}</Typography>
      </Box>

      <Box sx={{ mb: 3, p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          อัปเดตความคืบหน้า
        </Typography>
        <Stack spacing={2}>
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
            <Button variant="contained" onClick={handleProgressSubmit} disabled={submitting}>
              บันทึกลง Timeline
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom>
        Timeline
      </Typography>
      <TimelineList entries={timeline} />
    </Container>
  );
};

export default RequestDetailPage;
