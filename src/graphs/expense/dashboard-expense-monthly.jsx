import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MonthlyIncomeExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await fetch('http://localhost:8000/api/incomes/monthly-total/');
        const expenseResponse = await fetch('http://localhost:8000/api/expenses/monthly-total/');

        const incomeData = await incomeResponse.json();
        const expenseData = await expenseResponse.json();

        setData([
          {
            name: 'Current Month',
            Income: incomeData.monthly_income_total,
            Expense: expenseData.monthly_expense_total,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Income" fill="#82ca9d" />
      <Bar dataKey="Expense" fill="#8884d8" />
    </BarChart>
  );
};

export default MonthlyIncomeExpenseChart;
