import React from 'react';
import { LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from 'recharts';

const ExpenseLineChart = ({ data, category, width, height }) => {
    console.log(category);
  return (
    <ResponsiveContainer width={width} height={height}>
          <LineChart
        data={data}
        margin={{
          top: 5,
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
        <Line type="monotone" name={category} dataKey="total_expense" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>

        
      </ResponsiveContainer>
  );
};

export default ExpenseLineChart;