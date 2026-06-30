import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createUser, deleteUser, getUsers, updateUser } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';
import roles from '../../constants/roles';

const initialStaff = {
  displayName: '',
  email: '',
  role: roles.OPERATOR,
};

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialStaff);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotifications();

  const loadStaff = async () => {
    setLoading(true);
    try {
      const list = await getUsers();
      setStaff(list);
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถโหลดข้อมูลเจ้าหน้าที่ได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleOpenDialog = (member = null) => {
    if (member) {
      setForm({
        displayName: member.displayName || '',
        email: member.email || '',
        role: member.role || roles.OPERATOR,
      });
      setEditingId(member.id);
    } else {
      setForm(initialStaff);
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(initialStaff);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateUser(editingId, form);
        showNotification('แก้ไขข้อมูลเจ้าหน้าที่เรียบร้อย', 'success');
      } else {
        await createUser(form);
        showNotification('เพิ่มเจ้าหน้าที่ใหม่เรียบร้อย', 'success');
      }
      handleCloseDialog();
      await loadStaff();
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถบันทึกข้อมูลเจ้าหน้าที่ได้', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันลบเจ้าหน้าที่?')) {
      return;
    }
    try {
      await deleteUser(id);
      showNotification('ลบเจ้าหน้าที่เรียบร้อย', 'success');
      await loadStaff();
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถลบเจ้าหน้าที่ได้', 'error');
    }
  };

  const staffRows = useMemo(
    () =>
      staff.map((member) => (
        <TableRow key={member.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
          <TableCell sx={{ fontWeight: 700 }}>{member.displayName || '-'}</TableCell>
          <TableCell>{member.email || '-'}</TableCell>
          <TableCell>{member.role || '-'}</TableCell>
          <TableCell align="right">
            <IconButton size="small" onClick={() => handleOpenDialog(member)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      )),
    [staff]
  );

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">เจ้าหน้าที่</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            จัดการบัญชีและบทบาทผู้ใช้งาน
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          เพิ่มเจ้าหน้าที่
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>อีเมล</TableCell>
              <TableCell>บทบาท</TableCell>
              <TableCell align="right">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : (
              staffRows
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'แก้ไขเจ้าหน้าที่' : 'เพิ่มเจ้าหน้าที่ใหม่'}</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="ชื่อ"
              name="displayName"
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="อีเมล"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <TextField
              select
              fullWidth
              label="บทบาท"
              name="role"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              required
            >
              {Object.values(roles).map((roleValue) => (
                <MenuItem key={roleValue} value={roleValue}>
                  {roleValue}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default StaffPage;
