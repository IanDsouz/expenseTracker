import React, { useEffect, useState } from 'react';
import Summary from '../components/summary';
import Container from '@mui/material/Container';

function Dashboard() {
  return (
  <Container maxWidth="xl">
    <Summary></Summary>
  </Container>
  );
}

export default Dashboard;