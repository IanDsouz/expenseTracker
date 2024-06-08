import React, { useEffect, useState } from 'react';
import Summary from '../components/summary';
import Container from '@mui/material/Container';

function DashboardV2() {

  if(localStorage.getItem('access_token') === null){                   
    window.location.href = '/login'
  }

  return (
  <Container maxWidth="xl">
    <Summary></Summary>
  </Container>
  );
}

export default DashboardV2;