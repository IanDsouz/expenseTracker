import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Drawer } from "@mui/material";
import ThemeToggleButton from "./ThemeToggleButton/ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import NavDrawer from "./NavDrawer";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../src/firebase/firebase";

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user state
  const navigate = useNavigate();

  // Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('curr user', currentUser);
      setUser(currentUser); // Set the current user
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Toggle Drawer
  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      console.log("logout");
      await signOut(auth); // Sign out from Firebase
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Menu Icon to toggle drawer */}
          { user ? (
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
          ) : (<p/>)}

          {/* App Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashFlow
          </Typography>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />

          {/* Show if user is logged in */}
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => navigate("/monthly")}>
                Monthly
              </Button>
              <Button color="inherit" onClick={() => navigate("/analysis")}>
                Analysis
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin")}>
                Admin
              </Button>
              <Button color="inherit" onClick={() => navigate("/saved")}>
                Saved
              </Button>

              {/* Logout Button */}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            // Show Login button if not logged in
            <Button color="inherit" onClick={() => navigate("/")}>
              Login
            </Button>
          )}
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
