import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseLineChart from '../charts/expensemonthlyline';  // Adjust the import path based on your project structure
import { Box } from '@mui/system';

const ExpenseMonthlyCategory = ({ category,selectedYear, width, height }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/expense/${selectedYear}/${category}`)
            .then((response) => {
                console.log('res', response)
                setData(response.data.monthly_expenses);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedYear]);

    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ExpenseLineChart category={category} width={width} height={height} data={data} />
            )}
        </Box>
    );
}

export default ExpenseMonthlyCategory;