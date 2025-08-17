import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import NavDrawer from "./NavDrawer";
import { useAuth } from "../AuthContext";

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, loading, logout, isAuthenticated } = useAuth();

  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Don't render navigation while loading
  if (loading) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Menu Icon - Only show when authenticated */}
          {isAuthenticated && (
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
          )}

          {/* App Title */}
          <Typography 
            style={{cursor:'pointer'}} 
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")} 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            CashFlow
          </Typography>
          


          {/* Navigation Items - Only show when authenticated */}
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => handleNavigation("/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/monthly")}>
                Monthly
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/analysis")}>
                Analysis
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/admin")}>
                Admin
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/saved")}>
                Saved
              </Button>
              
              {/* User Menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer - Only render when authenticated */}
      {isAuthenticated && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <NavDrawer toggleDrawer={toggleDrawer} />
        </Drawer>
      )}
    </Box>
  );
}

export default Navigation;
