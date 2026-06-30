import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getSettings, updateSetting } from '../../services/firestoreService';
import { useNotifications } from '../../hooks/useNotifications';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotifications();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const settingItems = await getSettings();
      const data = settingItems.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
      setSettings(data);
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleChange = (field) => (event) => {
    setSettings((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const defaultSettingId = 'system-settings';
      await updateSetting(defaultSettingId, {
        ...settings,
        key: 'system-settings',
      });
      showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
    } catch (error) {
      console.error(error);
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Box>
        <Typography variant="h4">ตั้งค่า</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          กำหนดข้อมูลพื้นฐานของระบบ
        </Typography>
      </Box>

      {loading && <Alert severity="info">กำลังโหลดการตั้งค่า...</Alert>}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <TextField fullWidth label="ชื่อระบบ" value={settings.siteName || ''} onChange={handleChange('siteName')} />
          <TextField fullWidth label="อีเมลติดต่อ" value={settings.contactEmail || ''} onChange={handleChange('contactEmail')} />
          <FormControl fullWidth>
            <InputLabel>โหมดเริ่มต้น</InputLabel>
            <Select value={settings.defaultTheme || 'light'} label="โหมดเริ่มต้น" onChange={handleChange('defaultTheme')}>
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
