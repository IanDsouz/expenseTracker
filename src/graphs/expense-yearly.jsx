import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box } from '@mui/system';

const ExpenseYearlyGraph = ({ selectedYear, width, height }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        // Fetch yearly expense data for the selected year
        axios.get(`http://localhost:8000/api/yearly_expense/${selectedYear}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log('yearly', response.data);
            setData(response.data.expenses);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [selectedYear]);


    return (
        <Box>
            <BarChart width={width} height={height} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis  domain={[0, 6000]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
        </Box>

    );
}

export default ExpenseYearlyGraph;
