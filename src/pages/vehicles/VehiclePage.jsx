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
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';

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
    () => vehicles.map((vehicle) => (
      <TableRow key={vehicle.id} hover>
        <TableCell>{vehicle.licensePlate || '-'}</TableCell>
        <TableCell>{vehicle.name || '-'}</TableCell>
        <TableCell>{vehicle.type || '-'}</TableCell>
        <TableCell>{vehicle.status || '-'}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => handleOpenDialog(vehicle)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(vehicle.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )),
    [vehicles]
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">รถบริการ</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          เพิ่มรถใหม่
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ทะเบียน</TableCell>
              <TableCell>ชื่อรถ</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                กำลังโหลดข้อมูล...
              </TableCell>
            </TableRow>
          ) : vehicleRows}</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'แก้ไขรถบริการ' : 'เพิ่มรถบริการใหม่'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="ทะเบียนรถ"
              margin="normal"
              name="licensePlate"
              value={form.licensePlate}
              onChange={(event) => setForm((prev) => ({ ...prev, licensePlate: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="ชื่อรถ"
              margin="normal"
              name="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="ประเภทรถ"
              margin="normal"
              name="type"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="สถานะ"
              margin="normal"
              name="status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              required
            />
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

export default VehiclePage;
