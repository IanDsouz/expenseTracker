import React, { useEffect, useState } from 'react';
import MonthlySummary from '../components/monthlySummary';
import Container from '@mui/material/Container';

function DashboardMonthly() {

  return (
  <Container maxWidth="xl">
    <MonthlySummary></MonthlySummary>
  </Container>
  );
}

export default DashboardMonthly;