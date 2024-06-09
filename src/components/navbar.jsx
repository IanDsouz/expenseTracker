import React, { useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import ThemeToggleButton from './ThemeToggleButton/ThemeToggleButton';
 
function Navigation() {

   const [isAuth, setIsAuth] = useState(false);
   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true); 
      }
    }, [isAuth]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashFlow
          </Typography>

          <ThemeToggleButton />

          <Button color="inherit">Monthly</Button>

          {isAuth ? <Button color="inherit">Logout</Button> :  
                    <Button color="inherit">Login</Button>}
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navigation;