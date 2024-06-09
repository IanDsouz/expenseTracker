import React, { useEffect, useState } from 'react';
import Summary from '../components/summary';
import Container from '@mui/material/Container';

function DashboardV2() {
  if(localStorage.getItem('access_token') === null){                   
    window.location.href = '/login'
  }
  return (
    <Summary></Summary>
  );
}

export default DashboardV2;