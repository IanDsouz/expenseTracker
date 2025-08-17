import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useFetchWithToken from '../../firebase/useFetchWithToken';

const ExpenseMonthlyCategory = ({ category, selectedYear, selectedMonth, width = "100%", height = 80, onError }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: apiData, loading: apiLoading, error: apiError } = useFetchWithToken(
    `http://127.0.0.1:8000/api/expense/${selectedYear}/${encodeURIComponent(category)}`
  );

  useEffect(() => {
    if (apiData) {
      let transformedData = [];
      
      // Handle the response from /api/expense/{year}/{category} endpoint
      if (apiData.monthly_expenses && Array.isArray(apiData.monthly_expenses)) {
        transformedData = apiData.monthly_expenses.map((item, index) => ({
          date: item.month || `Month ${index + 1}`,
          amount: parseFloat(item.total_expense || item.amount || item.total) || 0
        }));
      } else if (Array.isArray(apiData)) {
        transformedData = apiData.map((item, index) => ({
          date: item.month || item.date || `Month ${index + 1}`,
          amount: parseFloat(item.total_expense || item.amount || item.total) || 0
        }));
      } else if (typeof apiData === 'object' && apiData.data) {
        // If data is nested under a 'data' property
        if (Array.isArray(apiData.data)) {
          transformedData = apiData.data.map((item, index) => ({
            date: item.month || item.date || `Month ${index + 1}`,
            amount: parseFloat(item.total_expense || item.amount || item.total) || 0
          }));
        }
      }
      
      // Sort by month order (convert month names to numbers for sorting)
      const monthOrder = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
        'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
      };
      
      transformedData.sort((a, b) => {
        const monthA = monthOrder[a.date] || 0;
        const monthB = monthOrder[b.date] || 0;
        return monthA - monthB;
      });
      
      console.log('ExpenseMonthlyCategory - Transformed data:', transformedData);
      setData(transformedData);
      setLoading(false);
    }
    if (apiError) {
      const errorMessage = apiError.message || 'Failed to load data';
      console.error('ExpenseMonthlyCategory - API Error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      if (onError) {
        onError(new Error(errorMessage));
      }
    }
  }, [apiData, apiError, category, selectedYear, selectedMonth, onError]);

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
        <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: 1, p: 1, boxShadow: 2, fontSize: '0.75rem' }}>
          <Typography variant="caption" fontWeight="bold">{label}</Typography>
          <Typography variant="caption" color="primary">{formatCurrency(payload[0].value)}</Typography>
        </Box>
      );
    }
    return null;
  };

  console.log(`ExpenseMonthlyCategory - ${category}:`, { 
    loading: loading || apiLoading, 
    error, 
    apiError, 
    dataLength: data?.length,
    apiData: apiData ? 'received' : 'none',
    data: data?.slice(0, 3) // Show first 3 items for debugging
  });

  if (loading || apiLoading) {
    return (<Box sx={{ width, height }}><Skeleton variant="rectangular" width="100%" height="100%" /></Box>);
  }
  if (error || apiError) {
    return (<Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 1 }}><Typography variant="caption" color="warning.main" align="center">Error: {error || apiError?.message}</Typography></Box>);
  }
  if (!data || data.length === 0) {
    return (<Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 1 }}><Typography variant="caption" color="text.secondary" align="center">No data for {category}</Typography></Box>);
  }

  return (
    <Box sx={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <CartesianGrid strokeDasharray="1 1" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            hide={true}
            type="category"
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#1976d2" 
            strokeWidth={2} 
            dot={{ r: 2, fill: '#1976d2' }} 
            activeDot={{ r: 4, stroke: '#1976d2', strokeWidth: 2 }} 
            connectNulls={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpenseMonthlyCategory;