import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
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
    () => staff.map((member) => (
      <TableRow key={member.id} hover>
        <TableCell>{member.displayName || '-'}</TableCell>
        <TableCell>{member.email || '-'}</TableCell>
        <TableCell>{member.role || '-'}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => handleOpenDialog(member)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )),
    [staff]
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">เจ้าหน้าที่</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          เพิ่มเจ้าหน้าที่
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>อีเมล</TableCell>
              <TableCell>บทบาท</TableCell>
              <TableCell>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                กำลังโหลดข้อมูล...
              </TableCell>
            </TableRow>
          ) : staffRows}</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'แก้ไขเจ้าหน้าที่' : 'เพิ่มเจ้าหน้าที่ใหม่'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="ชื่อ"
              margin="normal"
              name="displayName"
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="อีเมล"
              margin="normal"
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
              margin="normal"
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffPage;
