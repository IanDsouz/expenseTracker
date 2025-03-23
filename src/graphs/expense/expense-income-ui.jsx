import React, { useEffect, useState } from "react";
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
const ExpenseIncomeUI = ({ selectedYear, width = "100%", height = 400 }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await fetch(
          `http://localhost:8000/api/incomes/yearly-total/?year=${selectedYear}`
        );
        const expenseResponse = await fetch(
          `http://127.0.0.1:8000/api/year_monthly_expense/${selectedYear}`
        );

        const incomeJson = await incomeResponse.json();
        const expenseJson = await expenseResponse.json();

        const incomeData = incomeJson.income_total || 0;
        const expenseData = expenseJson.total_expense || 0;
        const savings = incomeData - expenseData;

        setData([{ name: selectedYear, Income: incomeData, Expenses: expenseData, Savings: savings }]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
        <ResponsiveContainer width={width} height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fill: "#555" }} />
            <YAxis tick={{ fill: "#555" }} />
            <Legend />
            <Bar dataKey="Income" fill="#16a34a" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Expenses" fill="#dc2626" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Savings" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
  );
};

export default ExpenseIncomeUI;
