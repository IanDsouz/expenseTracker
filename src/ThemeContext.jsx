import React, { createContext, useMemo, useState, useContext } from 'react';
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
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#121212',
    },
    text: {
      primary: '#fff',
    },
  },
});

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeValue = useMemo(() => {
    const muiTheme = theme === 'light' ? lightTheme : darkTheme;
    return { theme, toggleTheme, muiTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <ThemeProvider theme={themeValue.muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
