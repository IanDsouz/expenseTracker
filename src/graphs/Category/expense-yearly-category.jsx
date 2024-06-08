import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box } from '@mui/system';

const ExpenseYearlyCategory = ({ category,fromYear,toYear, width, height }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/expense/total/${fromYear}/${toYear}/${category}`)
            .then((response) => {
                console.log('res','/api/expense/total', response);
                setData(response.data.yearly_expenses);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fromYear, toYear ]);

    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                <p>{category}</p>
                <LineChart data={data} width={width} height={height}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="year" />
                            <YAxis 
                                domain={[0, 2000]}
                            />
                            <Tooltip 
                                formatter={(value) => new Intl.NumberFormat('en').format(value)} 
                                labelFormatter={(label) => `Year: ${label}`}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="total_expense" 
                                stroke="#82ca9d" 
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
            </div>
            )}
        </Box>
    );
}

export default ExpenseYearlyCategory;