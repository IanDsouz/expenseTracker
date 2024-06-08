import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import TagSummary from "../graphs/Tag/tag-summary";
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseTable from "../graphs/expense-monthly-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import ExpenseMonthlyPie from "../graphs/expense-monthly-pie"
import ExpenseYearMonthlyStacked from "../graphs/expense-monthly-stacked"

import ExpenseYearlyAllMonthlyBarStacked from "../graphs/expense-yearly-all-monthly-bar-stacked"


const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  display: 'flex',
  flexDirection: 'column',  // Align items vertically
  alignItems: 'center',      // Center items horizontally
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  width: "410px",  // Add your specific width
  height: "250px", // Add your specific height
  borderRadius: theme.spacing(2),
}));

const StyledPaperPie = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  display: 'flex',
  flexDirection: 'column',  // Align items vertically
  alignItems: 'center',      // Center items horizontally
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  width: "410px",  // Add your specific width
  height: "250px", // Add your specific height
  borderRadius: theme.spacing(2),
}));


function Summary() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleMonthChange = (date) => {
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid xs={4}>
        <ExpenseYearMonthlyStacked  width={400} height={200} />

        <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={400} height={200} />         
        
        </Grid>
        <Grid xs={4}>
        <div> div </div>
        </Grid>
        <Grid xs={4}>
        <Stack>
                  
        </Stack> 
        </Grid>
      </Grid>
    </Box>
  );
}

export default Summary;
