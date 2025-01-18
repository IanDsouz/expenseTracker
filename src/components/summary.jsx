import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import dayjs, { Dayjs } from "dayjs";
import ExpenseYearMonthlyGraph from '../graphs/expense-year-monthly';
import SavingsComponent from '../components/Savings/SavingsComponent';
import ExpenseYearlyGraph from '../graphs/expense-yearly';
import ExpenseYearlyAllMonthlyBarStacked from '../graphs/expense-yearly-all-monthly-bar-stacked';
import MonthlyIncomeExpenseChart from '../graphs/expense/dashboard-expense-monthly'

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), 
  marginBottom: '5px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

function Summary() {
const currentYear = dayjs().year();
const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <Box sx={{ padding: 1 }} height={100} >
      <Grid container spacing={1} >
        <Grid xs={3} >
        <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={400} height={200} /> 
        </Grid>
        <Grid xs={3}>
        <ExpenseYearlyGraph selectedYear={selectedYear} width={400} height={200}  />
        </Grid>
        <Grid xs={3}>
        <ExpenseYearlyAllMonthlyBarStacked selectedYear={selectedYear} width={400} height={200} />
        </Grid>
        <Grid xs={3}>

          <MonthlyIncomeExpenseChart />
       
      {/* <DemoPaper>
              <SavingsComponent></SavingsComponent>
            </DemoPaper> */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Summary;
