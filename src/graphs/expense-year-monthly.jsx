import React from 'react';
import { Line, ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box } from '@mui/system';
import useFetchWithToken from '../firebase/useFetchWithToken'; // adjust path if needed

const ExpenseYearMonthlyGraph = ({ selectedYear, width, height }) => {
  const url = `http://127.0.0.1:8000/api/year_monthly_expense/${selectedYear}`;
  const { data, loading, error } = useFetchWithToken(url);

  const chartData = data?.monthly_totals || [];

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message || 'An error occurred while fetching data.'}</p>
      ) : (
        <ComposedChart width={width} height={height} data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" tickFormatter={(value) => value.slice(0, 3)} />
          <YAxis domain={[0, 4400]} />
          <Tooltip />
          <Legend
            payload={[
              { value: 'Monthly Expense', type: 'square', color: '#536DFE' },
              { value: 'Trend', type: 'line', color: '#ff7300' },
            ]}
          />
          <Bar dataKey="value" barSize={20} fill="#536DFE" />
          <Line type="monotone" dataKey="value" stroke="#ff7300" name="Linear Trend" />
        </ComposedChart>
      )}
    </Box>
  );
};

export default ExpenseYearMonthlyGraph;
