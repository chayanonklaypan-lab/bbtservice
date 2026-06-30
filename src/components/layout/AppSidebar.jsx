import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'ปฏิทิน', icon: <CalendarMonthIcon />, path: '/calendar', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'คำร้อง', icon: <ListAltIcon />, path: '/requests', allowedRoles: ['Admin', 'Operator', 'Director'] },
  { label: 'ตารางปฏิบัติงาน', icon: <DirectionsCarIcon />, path: '/vehicles', allowedRoles: ['Admin', 'Operator'] },
  { label: 'เจ้าหน้าที่', icon: <PeopleIcon />, path: '/staff', allowedRoles: ['Admin'] },
  { label: 'รายงาน', icon: <BarChartIcon />, path: '/reports', allowedRoles: ['Admin', 'Director'] },
  { label: 'ตั้งค่า', icon: <SettingsIcon />, path: '/settings', allowedRoles: ['Admin'] },
];

const AppSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const visibleItems = menuItems.filter((item) => item.allowedRoles.includes(user?.role));

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6">เมนูหลัก</Typography>
        </Toolbar>
        <Divider />
        <List>
          {visibleItems.map((item) => (
            <ListItemButton key={item.label} component={RouterLink} to={item.path} onClick={onClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Toolbar>
          <Typography variant="h6">เมนูหลัก</Typography>
        </Toolbar>
        <Divider />
        <List>
          {visibleItems.map((item) => (
            <ListItemButton key={item.label} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

AppSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppSidebar;
