import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { Box } from '@mui/system';
import useFetchWithToken from '../firebase/useFetchWithToken';

const ExpenseYearlyGraph = ({ selectedYear, width, height }) => {
  const { data, loading, error } = useFetchWithToken(
    `http://localhost:8000/api/yearly_expense/${selectedYear}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <Box>
      <BarChart width={width} height={height} data={data ? data.expenses : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 6000]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </Box>
  );
};

export default ExpenseYearlyGraph;
