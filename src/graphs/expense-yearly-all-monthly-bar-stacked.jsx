import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useFetchWithToken from '../firebase/useFetchWithToken';

const ExpenseYearlyAllMonthlyBarStacked = ({ selectedYear, width = "100%", height = 400 }) => {
  // Use authenticated API call
  const { data: apiData, loading, error } = useFetchWithToken(
    `http://127.0.0.1:8000/api/expense_all_yearly_monthly_total/${selectedYear || 2021}`
  );

  const data = apiData?.data || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#17becf", "#FF5733"]; // Add more colors if needed

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: "white", padding: 1, border: "1px solid #ccc" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          {payload.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ color: item.fill }}>
              {item.name}: {item.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : data.length === 0 ? (
        <Typography>No data available for the selected year.</Typography>
      ) : (
        <ResponsiveContainer width={width} height={height}>
          <BarChart
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {Object.keys(data[0] || {})
              .filter((key) => key !== "month")
              .map((year, index) => (
                <Bar
                  key={year}
                  dataKey={year}
                  stackId="a"
                  fill={colors[index % colors.length]}
                  barSize={30}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ExpenseYearlyAllMonthlyBarStacked;