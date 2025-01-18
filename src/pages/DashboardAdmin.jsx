import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import AdminPage from './Admin/AdminPage';

function DashboardAdmin() {

  return (
  <Container maxWidth="xl">
    <AdminPage></AdminPage>
  </Container>
  );
}

export default DashboardAdmin;