import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const drawerWidth = 260;
const headerHeight = 64;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDrawerClose = () => setMobileOpen(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppHeader drawerWidth={drawerWidth} headerHeight={headerHeight} onOpenSidebar={handleDrawerToggle} />
      <AppSidebar drawerWidth={drawerWidth} open={mobileOpen} onClose={handleDrawerClose} />
      <Box
        component="main"
        sx={{
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          pt: `${headerHeight}px`,
        }}
      >
        <Box
          sx={{
            width: '100%',
            px: { xs: 2, sm: 3, xl: 4 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
