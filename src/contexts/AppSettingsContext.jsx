import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSystemSettings, updateSystemSettings } from '../services/firestoreService';

export const defaultAppSettings = {
  organizationName: 'เทศบาลนครบางบัวทอง',
  siteName: 'ระบบบริหารงานบริการสาธารณสุข',
  contactEmail: '',
  defaultTheme: 'light',
};

const AppSettingsContext = createContext(null);

const normalizeSettings = (settings = {}) => ({
  ...defaultAppSettings,
  ...settings,
  organizationName: `${settings.organizationName || defaultAppSettings.organizationName}`.trim(),
  siteName: `${settings.siteName || defaultAppSettings.siteName}`.trim(),
  contactEmail: `${settings.contactEmail || ''}`.trim(),
  defaultTheme: settings.defaultTheme === 'dark' ? 'dark' : 'light',
});

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultAppSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSystemSettings();
      setSettings(normalizeSettings(data));
    } catch (error) {
      console.error(error);
      setSettings(defaultAppSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const saveSettings = useCallback(async (nextSettings) => {
    const normalizedSettings = normalizeSettings(nextSettings);
    await updateSystemSettings(normalizedSettings);
    setSettings(normalizedSettings);
    return normalizedSettings;
  }, []);

  const value = useMemo(
    () => ({ settings, loading, refreshSettings, saveSettings }),
    [settings, loading, refreshSettings, saveSettings]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
};
