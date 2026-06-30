import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { createRequest, getUsers, getVehicles } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';
import requestTypes from '../../constants/requestTypes';

const defaultValues = {
  requesterName: '',
  requesterPhone: '',
  requestType: '',
  description: '',
  address: '',
  district: '',
  amphoe: '',
  province: '',
  assigneeId: '',
  vehicleId: '',
};

const RequestFormPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [assignees, setAssignees] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  useEffect(() => {
    const loadSelections = async () => {
      try {
        const [userList, vehicleList] = await Promise.all([getUsers(), getVehicles()]);
        setAssignees(userList);
        setVehicles(vehicleList);
      } catch (error) {
        console.error(error);
      }
    };

    loadSelections();
  }, []);

  const onSubmit = async (data) => {
    try {
      await createRequest(data);
      showNotification('สร้างคำร้องเรียบร้อย', 'success');
      navigate('/requests');
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถสร้างคำร้องได้', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        สร้างคำร้องใหม่
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="requesterName"
          control={control}
          render={({ field }) => <TextField fullWidth label="ชื่อผู้แจ้ง" margin="normal" {...field} required />}
        />
        <Controller
          name="requesterPhone"
          control={control}
          render={({ field }) => <TextField fullWidth label="เบอร์โทร" margin="normal" {...field} required />}
        />
        <Controller
          name="requestType"
          control={control}
          render={({ field }) => (
            <TextField select fullWidth label="ประเภทงาน" margin="normal" {...field} required>
              {Object.values(requestTypes).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => <TextField fullWidth label="รายละเอียด" margin="normal" multiline minRows={4} {...field} required />}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => <TextField fullWidth label="ที่อยู่" margin="normal" {...field} />}
        />
        <Box sx={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Controller
            name="district"
            control={control}
            render={({ field }) => <TextField fullWidth label="ตำบล/แขวง" margin="normal" {...field} />}
          />
          <Controller
            name="amphoe"
            control={control}
            render={({ field }) => <TextField fullWidth label="อำเภอ" margin="normal" {...field} />}
          />
          <Controller
            name="province"
            control={control}
            render={({ field }) => <TextField fullWidth label="จังหวัด" margin="normal" {...field} />}
          />
        </Box>
        <Controller
          name="vehicleId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>รถบริการ</InputLabel>
              <Select label="รถบริการ" {...field}>
                <MenuItem value="">ไม่ระบุ</MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.licensePlate})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>ผู้รับมอบหมาย</InputLabel>
              <Select label="ผู้รับมอบหมาย" {...field}>
                <MenuItem value="">ไม่ระบุ</MenuItem>
                {assignees.map((assignee) => (
                  <MenuItem key={assignee.id} value={assignee.id}>
                    {assignee.displayName || assignee.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/requests')}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            บันทึกคำร้อง
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RequestFormPage;
