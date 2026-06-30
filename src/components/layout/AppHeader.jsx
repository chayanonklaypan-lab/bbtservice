import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Chip, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const AppHeader = ({ drawerWidth, headerHeight, onOpenSidebar }) => {
  const { mode, toggleTheme } = useThemeMode();
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ minHeight: `${headerHeight}px !important`, gap: 1.5, px: { xs: 2, sm: 3 } }}>
        <IconButton edge="start" color="inherit" onClick={onOpenSidebar} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20 } }}>
            ระบบบริหารงานบริการสาธารณสุข
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
            จัดการคำร้อง ตารางงาน รถบริการ และรายงาน
          </Typography>
        </Box>
        {user && (
          <Chip
            avatar={<Avatar>{user.displayName?.charAt(0) || 'U'}</Avatar>}
            label={user.displayName}
            variant="outlined"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, maxWidth: 180 }}
          />
        )}
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  onOpenSidebar: PropTypes.func.isRequired,
};

export default AppHeader;
