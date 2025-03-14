import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Drawer } from '@mui/material';
import ThemeToggleButton from './ThemeToggleButton/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import NavDrawer from './NavDrawer';

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Menu Icon to toggle drawer */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* App Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashFlow
          </Typography>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />

          {/* Navigation Buttons */}
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/monthly')}>
            Monthly
          </Button>
          <Button color="inherit" onClick={() => navigate('/analysis')}>
            Analysis
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin')}>
            Admin
          </Button>
          <Button color="inherit" onClick={() => navigate('/saved')}>
            Saved
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <NavDrawer toggleDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
}

export default Navigation;
