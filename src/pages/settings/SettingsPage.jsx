import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { defaultAppSettings, useAppSettings } from '../../contexts/AppSettingsContext';
import { useNotifications } from '../../hooks/useNotifications';

const toTrimmedString = (value) => `${value ?? ''}`.trim();

const normalizeForm = (settings) => ({
  organizationName: toTrimmedString(settings.organizationName),
  siteName: toTrimmedString(settings.siteName),
  contactEmail: toTrimmedString(settings.contactEmail),
  defaultTheme: settings.defaultTheme === 'dark' ? 'dark' : 'light',
});

const SettingsPage = () => {
  const { settings, loading, saveSettings } = useAppSettings();
  const [form, setForm] = useState(defaultAppSettings);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotifications();

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    const normalizedForm = normalizeForm(form);

    if (!normalizedForm.organizationName || !normalizedForm.siteName) {
      showNotification('กรุณากรอกชื่อหน่วยงานและชื่อระบบ', 'warning');
      return;
    }

    if (normalizedForm.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedForm.contactEmail)) {
      showNotification('รูปแบบอีเมลติดต่อไม่ถูกต้อง', 'warning');
      return;
    }

    setSaving(true);
    try {
      await saveSettings(normalizedForm);
      showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 820 }}>
      <Box>
        <Typography variant="h4">ตั้งค่า</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          กำหนดข้อมูลที่แสดงบนหัวเว็บ เมนูด้านซ้าย และโหมดเริ่มต้น
        </Typography>
      </Box>

      {loading && <Alert severity="info">กำลังโหลดการตั้งค่า...</Alert>}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="ชื่อหน่วยงาน"
            value={form.organizationName || ''}
            onChange={handleChange('organizationName')}
            helperText="แสดงในหัวเมนูด้านซ้ายและหน้าเข้าสู่ระบบ"
            required
          />
          <TextField
            fullWidth
            label="ชื่อระบบ"
            value={form.siteName || ''}
            onChange={handleChange('siteName')}
            helperText="แสดงบนหัวเว็บและใต้ชื่อหน่วยงาน"
            required
          />
          <TextField
            fullWidth
            label="อีเมลติดต่อ"
            value={form.contactEmail || ''}
            onChange={handleChange('contactEmail')}
            helperText="ถ้ากรอก จะแสดงท้ายเมนูด้านซ้าย"
          />
          <FormControl fullWidth>
            <InputLabel>โหมดเริ่มต้น</InputLabel>
            <Select value={form.defaultTheme || 'light'} label="โหมดเริ่มต้น" onChange={handleChange('defaultTheme')}>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving || loading}>
              บันทึกการตั้งค่า
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
