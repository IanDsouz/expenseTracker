import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton/ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import NavDrawer from "./NavDrawer";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase/firebase";
import { useAuth } from "../AuthContext";

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          {user && (
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
          <Typography style={{cursor:'pointer'}} onClick={() => navigate("/")} variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashFlow
          </Typography>
          
          <ThemeToggleButton />

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
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

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
