import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Box, Typography, Skeleton, Alert } from "@mui/material";
import useFetchWithToken from "../firebase/useFetchWithToken";

const ExpenseYearMonthlyGraph = ({ selectedYear, width = "100%", height = 300 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: apiData, loading: apiLoading, error: apiError } = useFetchWithToken(
    `http://127.0.0.1:8000/api/year_monthly_expense/${selectedYear}`
  );

  useEffect(() => {
    if (apiData) {
      // Transform the data to match the chart format
      const transformedData = Object.entries(apiData).map(([month, amount]) => ({
        month: month,
        amount: parseFloat(amount) || 0
      }));
      
      // Sort by month order
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      
      transformedData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
      
      setData(transformedData);
      setLoading(false);
    }
    if (apiError) {
      setError(apiError.message);
      setLoading(false);
    }
  }, [apiData, apiError]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            {formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading || apiLoading) {
    return (
      <Box sx={{ width, height }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">
          Failed to load chart data: {error}
        </Alert>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data available for {selectedYear}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpenseYearMonthlyGraph;
