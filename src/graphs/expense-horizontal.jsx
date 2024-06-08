import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const ExpenseGraphHorizontal = ({ selectedYear,selectedMonth  }) => {
    const colors = [
        '#f44336', // Red
        '#e91e63', // Pink
        '#9c27b0', // Purple
        '#673ab7', // Deep Purple
        '#3f51b5', // Indigo
        '#2196f3', // Blue
        '#03a9f4', // Light Blue
        '#00bcd4', // Cyan
        '#009688', // Teal
        '#4caf50', // Green
        '#8bc34a', // Light Green
        '#cddc39', // Lime
        '#ffeb3b', // Yellow
        '#ffc107', // Amber
        '#ff9800', // Orange
        '#ff5722', // Deep Orange
        '#795548'  // Brown
      ];
    const displayMonth = dayjs(`${selectedYear}-${selectedMonth}`);

    console.log('monthhh', displayMonth);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
        name,
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        const labelStyle = {
          fontSize: '10px', 
          textAnchor: 'middle',
          dominantBaseline: 'hanging',
          fill: 'white',
        };
      
        return (
          <g>
            <text x={x} y={y - 6} style={labelStyle}>
              {`${name} - ${data[index].total}`}
            </text>
            <text x={x} y={y + 10} style={labelStyle}>
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          </g>
        );
      };

    const [data, setData] = useState(null);
    useEffect(() => {
        axios
          .get(`http://127.0.0.1:8000/api/expense_summary/${selectedYear}/${selectedMonth}`)
          .then((response) => {
            console.log('res', response.data.expenses);
            setData(response.data.expenses.filter((entry) => entry.total > 0));
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [selectedYear, selectedMonth]);

      if(!data)
      {
        return (
            <div>Loading...</div>
        )
      }

    return (
      <div >
        <h2>{displayMonth.format('MMMM')} {selectedYear} </h2>
        <PieChart width={600} height={600} style={{paddingLeft:'25%'}}>
            <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) =>
                renderCustomizedLabel({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
                name: data[index].name, // Pass the 'name' property from the data array
                })
                }
                outerRadius={200}
                fill="#8884d8"
                dataKey="total"
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
    </PieChart>
      </div>
    );
  };

  export default ExpenseGraphHorizontal;
