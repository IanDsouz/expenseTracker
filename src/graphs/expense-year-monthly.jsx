import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Line, ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Card from '@mui/material/Card';
import Paper from "@mui/material/Paper";
import { Box } from '@mui/system';

const ExpenseYearMonthlyGraph = ({ selectedYear, width, height }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/year_monthly_expense/${selectedYear}`)
            .then((response) => {
                console.log('test',response)
                setData(response.data.monthly_totals);
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
            <Box >
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ComposedChart width={width} height={height} data={data}>
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
}

export default ExpenseYearMonthlyGraph;
