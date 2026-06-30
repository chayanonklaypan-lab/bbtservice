import React from 'react';
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import statusColors from '../../constants/statusColors';

const RequestTable = ({ requests, onRowClick }) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow>
            <TableCell>เลขคำร้อง</TableCell>
            <TableCell>วันที่รับคำร้อง</TableCell>
            <TableCell>ชื่อผู้แจ้ง</TableCell>
            <TableCell>ประเภทงาน</TableCell>
            <TableCell>สถานะ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">ยังไม่มีข้อมูลคำร้อง</Typography>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow
                key={request.id}
                hover
                onClick={() => onRowClick(request.id)}
                sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell sx={{ fontWeight: 700 }}>{request.requestId || request.id}</TableCell>
                <TableCell>{request.receivedDate || '-'}</TableCell>
                <TableCell>{request.requesterName || '-'}</TableCell>
                <TableCell>{request.requestType || '-'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={request.status || '-'}
                    sx={{
                      minWidth: 92,
                      fontWeight: 700,
                      backgroundColor: statusColors[request.status] || 'grey.200',
                      color: statusColors[request.status] ? 'white' : 'text.primary',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
