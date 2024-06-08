import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';

const ExpenseYearMonthlyLine = ({ width, height }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#A05379",
        "#3F7C3A",
    ]; 

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/year_monthly_expense_total/2022`)
            .then((response) => {
                console.log('new', response.data.data);
                setData(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Month: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ResponsiveContainer width={width} height={height}>
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {data.map((yearData, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey="total_expense"
                                name={`Year ${yearData.year}`}
                                stroke={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default ExpenseYearMonthlyLine;
