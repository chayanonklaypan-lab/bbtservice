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
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';

const vehicleStatuses = ['พร้อม', 'กำลังใช้งาน', 'ซ่อมบำรุง', 'งดใช้งาน'];

const initialVehicle = {
  licensePlate: '',
  name: '',
  type: '',
  status: 'พร้อม',
};

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialVehicle);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotifications();

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const list = await getVehicles();
      setVehicles(list);
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถโหลดข้อมูลรถได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleOpenDialog = (vehicle = null) => {
    if (vehicle) {
      setForm({
        licensePlate: vehicle.licensePlate || '',
        name: vehicle.name || '',
        type: vehicle.type || '',
        status: vehicle.status || 'พร้อม',
      });
      setEditingId(vehicle.id);
    } else {
      setForm(initialVehicle);
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(initialVehicle);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateVehicle(editingId, form);
        showNotification('แก้ไขข้อมูลรถเรียบร้อย', 'success');
      } else {
        await createVehicle(form);
        showNotification('เพิ่มรถใหม่เรียบร้อย', 'success');
      }
      handleCloseDialog();
      await loadVehicles();
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถบันทึกข้อมูลรถได้', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันลบข้อมูลรถ?')) {
      return;
    }
    try {
      await deleteVehicle(id);
      showNotification('ลบรถเรียบร้อย', 'success');
      await loadVehicles();
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถลบรถได้', 'error');
    }
  };

  const vehicleRows = useMemo(
    () =>
      vehicles.map((vehicle) => (
        <TableRow key={vehicle.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
          <TableCell sx={{ fontWeight: 700 }}>{vehicle.licensePlate || '-'}</TableCell>
          <TableCell>{vehicle.name || '-'}</TableCell>
          <TableCell>{vehicle.type || '-'}</TableCell>
          <TableCell>{vehicle.status || '-'}</TableCell>
          <TableCell align="right">
            <IconButton size="small" onClick={() => handleOpenDialog(vehicle)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(vehicle.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      )),
    [vehicles]
  );

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">รถบริการ</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            จัดการทะเบียนรถและสถานะพร้อมใช้งาน
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          เพิ่มรถใหม่
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>ทะเบียน</TableCell>
              <TableCell>ชื่อรถ</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="right">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : (
              vehicleRows
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'แก้ไขรถบริการ' : 'เพิ่มรถบริการใหม่'}</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="ทะเบียนรถ"
              name="licensePlate"
              value={form.licensePlate}
              onChange={(event) => setForm((prev) => ({ ...prev, licensePlate: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="ชื่อรถ"
              name="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="ประเภทรถ"
              name="type"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              required
            />
            <TextField
              select
              fullWidth
              label="สถานะ"
              name="status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              required
            >
              {vehicleStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
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

export default VehiclePage;
