import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getRequests } from '../../services/firestoreService';
import SearchFilterPanel from '../../components/ui/SearchFilterPanel';
import RequestTable from '../../components/tables/RequestTable';

const RequestListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests(filters);
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถโหลดคำร้องได้ในขณะนี้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const handleReset = () => {
    setFilters({});
  };

  const filteredRequests = useMemo(() => {
    if (!filters.search) {
      return requests;
    }

    const searchText = filters.search.toLowerCase();
    return requests.filter((item) =>
      [item.requestId, item.requesterName, item.requesterPhone].some((value) =>
        value?.toLowerCase().includes(searchText)
      )
    );
  }, [filters.search, requests]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">คำร้องบริการ</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            ติดตามและจัดการคำร้องทั้งหมดในระบบ
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/requests/new')}>
          สร้างคำร้องใหม่
        </Button>
      </Stack>

      <SearchFilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Alert severity="info">กำลังโหลดคำร้อง...</Alert>}
      <RequestTable requests={filteredRequests} onRowClick={(id) => navigate(`/requests/${id}`)} />
    </Stack>
  );
};

export default RequestListPage;
