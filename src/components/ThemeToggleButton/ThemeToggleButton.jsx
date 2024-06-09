import React from 'react';
import { useThemeContext } from '../../ThemeContext';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import styles from './ThemeToggleButton.module.css';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <IconButton
      onClick={toggleTheme}
      className={styles.toggleButton}
      color="inherit"
    >
      {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
};

export default ThemeToggleButton;
