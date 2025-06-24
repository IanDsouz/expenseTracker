import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Format Y-axis numbers
const formatCurrency = (value) => {
  if (value >= 1000) return `£${(value / 1000).toFixed(1)}k`;
  return `£${value}`;
};

const ExpenseLineChart = ({ data, category, height }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 5,
          left: -30,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          width={60}
        />
        <Tooltip
  formatter={(value) => [`£${value.toFixed(2)}`, 'Expense']}
  labelFormatter={(label) => `Month: ${label}`}
/>
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          name={category}
          dataKey="total_expense"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseLineChart;
