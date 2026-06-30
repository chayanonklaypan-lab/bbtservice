import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
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

const toTrimmedString = (value) => `${value ?? ''}`.trim();

const trimRequestForm = (request) => ({
  requesterName: toTrimmedString(request.requesterName),
  requesterPhone: toTrimmedString(request.requesterPhone),
  requestType: request.requestType,
  description: toTrimmedString(request.description),
  address: toTrimmedString(request.address),
  district: toTrimmedString(request.district),
  amphoe: toTrimmedString(request.amphoe),
  province: toTrimmedString(request.province),
  assigneeId: request.assigneeId,
  vehicleId: request.vehicleId,
});

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
    const normalizedData = trimRequestForm(data);

    if (
      !normalizedData.requesterName ||
      !normalizedData.requesterPhone ||
      !normalizedData.requestType ||
      !normalizedData.description
    ) {
      showNotification('กรุณากรอกชื่อผู้แจ้ง เบอร์โทร ประเภทงาน และรายละเอียด', 'warning');
      return;
    }

    try {
      await createRequest(normalizedData);
      showNotification('สร้างคำร้องเรียบร้อย', 'success');
      navigate('/requests');
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถสร้างคำร้องได้', 'error');
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 980 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">สร้างคำร้องใหม่</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            บันทึกข้อมูลผู้แจ้ง รายละเอียดงาน และผู้รับผิดชอบ
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')}>
          กลับ
        </Button>
      </Stack>

      <Paper component="form" onSubmit={handleSubmit(onSubmit)} noValidate variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">ข้อมูลผู้แจ้ง</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="requesterName"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="ชื่อผู้แจ้ง" {...field} required />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="requesterPhone"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="เบอร์โทร" {...field} required />}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6">รายละเอียดงาน</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="requestType"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="ประเภทงาน" {...field} required>
                      {Object.values(requestTypes).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <TextField fullWidth label="รายละเอียด" multiline minRows={4} {...field} required />}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6">สถานที่</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller name="address" control={control} render={({ field }) => <TextField fullWidth label="ที่อยู่" {...field} />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="district" control={control} render={({ field }) => <TextField fullWidth label="ตำบล/แขวง" {...field} />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="amphoe" control={control} render={({ field }) => <TextField fullWidth label="อำเภอ" {...field} />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="province" control={control} render={({ field }) => <TextField fullWidth label="จังหวัด" {...field} />} />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6">การมอบหมาย</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>รถบริการ</InputLabel>
                      <Select label="รถบริการ" {...field}>
                        <MenuItem value="">ไม่ระบุ</MenuItem>
                        {vehicles.map((vehicle) => (
                          <MenuItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} ({vehicle.licensePlate}){vehicle.driverName ? ` - คนขับ: ${vehicle.driverName}` : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
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
              </Grid>
            </Grid>
          </Box>

          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" spacing={1.5}>
            <Button variant="outlined" onClick={() => navigate('/requests')}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={isSubmitting}>
              บันทึกคำร้อง
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default RequestFormPage;
