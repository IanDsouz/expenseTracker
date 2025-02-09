import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';

function NavDrawer({ toggleDrawer }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    toggleDrawer(false); // Close the drawer
    navigate(path); // Navigate to the specified path
  };

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/monthly')}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Monthly" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/analysis')}>
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Analysis" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/admin')}>
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
}

export default NavDrawer;
