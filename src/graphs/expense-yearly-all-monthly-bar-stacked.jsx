import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/system';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseYearlyAllMonthlyBarStacked = ({ selectedYear, width, height }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/expense_all_yearly_monthly_total/2021`)
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedYear]);

    // Define fixed colors for each year
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#17becf', '#FF5733']; // Add more colors if needed

    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ResponsiveContainer width={width} height={height}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {/* Map through years and use fixed colors for each bar */}
                        {Object.keys(data[0]).filter(key => key !== 'month').map((year, index) => (
                            <Bar key={index} dataKey={year} stackId="a" fill={colors[index % colors.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
}

export default ExpenseYearlyAllMonthlyBarStacked;
