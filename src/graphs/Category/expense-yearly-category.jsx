import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box } from '@mui/system';
import useFetchWithToken from '../../firebase/useFetchWithToken';

const ExpenseYearlyCategory = ({ category,fromYear,toYear, width, height }) => {

    const url = `http://127.0.0.1:8000/api/expense/total/${fromYear}/${toYear}/${category}`;
    const { data, loading, error } = useFetchWithToken(url);
    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                <p>{category}</p>
                <LineChart data={data.yearly_expenses} width={width} height={height}>
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