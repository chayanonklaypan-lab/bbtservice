import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Stack, Typography } from '@mui/material';
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">คำร้องบริการ</Typography>
        <Button variant="contained" onClick={() => navigate('/requests/new')}>
          สร้างคำร้องใหม่
        </Button>
      </Stack>

      <SearchFilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
      <RequestTable requests={filteredRequests} onRowClick={(id) => navigate(`/requests/${id}`)} />
      {loading && <Typography sx={{ mt: 2 }}>กำลังโหลดคำร้อง...</Typography>}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default RequestListPage;
