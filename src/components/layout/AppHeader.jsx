import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const AppHeader = ({ onOpenSidebar }) => {
  const { mode, toggleTheme } = useThemeMode();
  const { user } = useAuth();

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onOpenSidebar} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap>
            ระบบบริหารงานบริการสาธารณสุข
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {user && (
          <Typography variant="body2" sx={{ ml: 2, mr: 1 }}>
            {user.displayName}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  onOpenSidebar: PropTypes.func.isRequired,
};

export default AppHeader;
