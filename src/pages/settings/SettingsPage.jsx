import React, { useEffect, useState } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        ตั้งค่า
      </Typography>
      <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <TextField
          fullWidth
          label="ชื่อระบบ"
          value={settings.siteName || ''}
          onChange={handleChange('siteName')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="อีเมลติดต่อ"
          value={settings.contactEmail || ''}
          onChange={handleChange('contactEmail')}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>โหมดเริ่มต้น</InputLabel>
          <Select value={settings.defaultTheme || 'light'} label="โหมดเริ่มต้น" onChange={handleChange('defaultTheme')}>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading} sx={{ mt: 2 }}>
          บันทึกการตั้งค่า
        </Button>
      </Box>
      {loading && <Typography sx={{ mt: 2 }}>กำลังโหลดการตั้งค่า...</Typography>}
    </Container>
  );
};

export default SettingsPage;
