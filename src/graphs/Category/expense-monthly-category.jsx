import React, { useEffect, useState } from 'react';
import ExpenseLineChart from '../charts/expensemonthlyline';  // Adjust the import path based on your project structure
import { Box } from '@mui/system';
import useFetchWithToken from '../../firebase/useFetchWithToken';

const ExpenseMonthlyCategory = ({ category,selectedYear, width, height }) => {

    const { data, loading, error } = useFetchWithToken(
        `http://127.0.0.1:8000/api/expense/${selectedYear}/${category}`
      );
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ExpenseLineChart category={category} width={width} height={height} data={data.monthly_expenses} />
            )}
        </Box>
    );
}

export default ExpenseMonthlyCategory;