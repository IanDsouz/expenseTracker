import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#000',
    },
  },
});


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e88e5', // Bright blue
    },
    secondary: {
      main: '#f50057', // Vibrant pink
    },
    background: {
      default: '#0d0d0d', // Almost black
      paper: '#1a1a1a',   // Slightly lighter black for cards and surfaces
    },
    text: {
      primary: '#e0e0e0', // Soft white for primary text
      secondary: '#b0b0b0', // Grey for secondary text
    },
    divider: '#333333', // Subtle divider lines
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes default gradient
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Optional: Customize font family
  },
});

export const ThemeContextProvider = ({ children }) => {
  // Read the initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  // Update localStorage whenever the theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const themeValue = useMemo(() => {
    const muiTheme = theme === 'dark' ? darkTheme : lightTheme;
    return { theme, toggleTheme, muiTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <ThemeProvider theme={themeValue.muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
