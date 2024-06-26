import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A05379",
  "#3F7C3A",
]; // You can add more colors as needed

const ExpenseMonthlyPie = ({ selectedYear, selectedMonth }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/expense_summary_top/${selectedYear}/${selectedMonth}`
      )
      .then((response) => {
        console.log("expense_summary_top",response);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedYear, selectedMonth]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Filter out categories with zero values
  const filteredExpenses = data.expenses.slice(0, 6).filter((category) => category.total !== 0);

  const pieChartData = filteredExpenses.map((category) => ({
    name: category.name,
    value: category.total,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="right" verticalAlign="middle" layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpenseMonthlyPie;
