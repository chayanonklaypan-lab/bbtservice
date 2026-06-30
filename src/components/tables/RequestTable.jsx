import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import statusColors from '../../constants/statusColors';

const RequestTable = ({ requests, onRowClick }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
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
          {requests.map((request) => (
            <TableRow key={request.id} hover onClick={() => onRowClick(request.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>{request.requestId || request.id}</TableCell>
              <TableCell>{request.receivedDate || '-'}</TableCell>
              <TableCell>{request.requesterName || '-'}</TableCell>
              <TableCell>{request.requestType || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={request.status || '-'}
                  sx={{ backgroundColor: statusColors[request.status] || undefined, color: 'white' }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
