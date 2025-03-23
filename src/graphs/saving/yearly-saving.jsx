import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';

const FinancialSummaryGraph = ({ selectedYear, width, height }) => {
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/financial-summary/?year=${selectedYear}`)
            .then((response) => {
                console.log('API Response:', response.data);
                setData(response.data.monthly_data || []);
                setTotals({
                    totalIncome: response.data.total_income,
                    totalExpense: response.data.total_expense,
                    totalSavings: response.data.total_savings,
                    totalNetSavings: response.data.total_net_savings,
                    totalYearlySavings: response.data.net_savings_all_years,
                });
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
        <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 2 }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {/* Summary Section using Grid2 */}
                    <Grid container spacing={2}>
                    <Grid size={3}>
                            <Card sx={{ bgcolor: '#2196f3', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Total Savings</Typography>
                                    <Typography variant="h5">£{totals.totalYearlySavings.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={3}>
                            <Card sx={{ bgcolor: '#4caf50', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Total Income</Typography>
                                    <Typography variant="h5">£{totals.totalIncome.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={3}>
                            <Card sx={{ bgcolor: '#f44336', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Total Expenses</Typography>
                                    <Typography variant="h5">£{totals.totalExpense.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={3}>
                        <Card sx={{ bgcolor: '#ff9800', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Projected Savings</Typography>
                                    <Typography variant="h5">£{totals.totalNetSavings.toFixed(2)}</Typography>
                                </CardContent>
                            </Card>
    
                        </Grid>

                    </Grid>

                    {/* Graph Section using Grid2 */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid size={12}>
                            <Card>
                                <CardContent>
                                    <ComposedChart width={width} height={height} data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tickFormatter={(value) => value.slice(0, 3)} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="income" fill="#4caf50" name="Income" />
                                        <Bar dataKey="expenses" fill="#f44336" name="Expenses" />
                                        <Line type="monotone" dataKey="net_savings" stroke="#2196f3" strokeWidth={2} name="Net Savings" />
                                    </ComposedChart>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default FinancialSummaryGraph;
