import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import municipalityLogo from '../../assets/municipality-logo.jpg';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'ปฏิทิน', icon: <CalendarMonthIcon />, path: '/calendar', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'คำร้อง', icon: <ListAltIcon />, path: '/requests', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'รถบริการ', icon: <DirectionsCarIcon />, path: '/vehicles', allowedRoles: ['Admin', 'Operator'] },
  { label: 'เจ้าหน้าที่', icon: <PeopleIcon />, path: '/staff', allowedRoles: ['Admin'] },
  { label: 'รายงาน', icon: <BarChartIcon />, path: '/reports', allowedRoles: ['Admin', 'Director'] },
  { label: 'ตั้งค่า', icon: <SettingsIcon />, path: '/settings', allowedRoles: ['Admin'] },
];

const AppSidebar = ({ drawerWidth, open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const visibleItems = menuItems.filter((item) => item.allowedRoles.includes(user?.role));

  const drawerContent = (
    <Box sx={{ display: 'flex', minHeight: '100%', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.25, minHeight: 64 }}>
        <Box
          component="img"
          src={municipalityLogo}
          alt="เทศบาลนครบางบัวทอง"
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: 1,
            borderColor: 'divider',
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, lineHeight: 1.25 }}>
            เทศบาลนครบางบัวทอง
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.25 }}>
            ระบบงานบริการสาธารณสุข
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1.25, py: 1.25 }}>
        {visibleItems.map((item) => {
          const selected = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.path}
              selected={selected}
              onClick={onClose}
              sx={{
                mb: 0.5,
                minHeight: 42,
                px: 1.5,
                borderRadius: 1.25,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'inherit' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 800 : 600 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

AppSidebar.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppSidebar;
