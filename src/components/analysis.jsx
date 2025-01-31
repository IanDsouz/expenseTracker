import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import ExpenseYearlyCategory from "../graphs/category/expense-yearly-category"
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';


function Analysis() {
    const currentYear = dayjs().year();
    const [fromYear, setFromYear] = useState(dayjs().year(currentYear - 2));
    const [toYear, setToYear] = useState(dayjs().year(currentYear));
  
    const handleFromYearChange = (date) => {
        setFromYear(date);
    };

    const handleToYearChange = (date) => {
          setToYear(date);
      };
  
  // Calculate fromDate and toDate
  const fromDate = fromYear.format('YYYY');
  const toDate = toYear.format('YYYY');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year']}
              label="From year"
              value={fromYear}
              onChange={(date) => handleFromYearChange(date, true)}
              inputFormat="YYYY"
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year']}
              label="To year"
              value={toYear}
              onChange={(date) => handleToYearChange(date, true)}
              inputFormat="YYYY"
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
        </LocalizationProvider>
        </Stack>
      <Grid container spacing={1}>
        <Grid xs={3}>
            <Stack>
            <ExpenseYearlyCategory category="Groceries" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />  
            <ExpenseYearlyCategory category="Transportation" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />       
            </Stack>
        </Grid>
        <Grid xs={3}>
        <ExpenseYearlyCategory category="Outside Food" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />       
        <ExpenseYearlyCategory category="Car" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />       
        <ExpenseYearlyCategory category="Personal" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />       
        
        </Grid>
        <Grid xs={3}>
        <Stack>
        <ExpenseYearlyCategory category="Hotel" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />   
        <ExpenseYearlyCategory category="Takeway" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />       
            <ExpenseYearlyCategory category="Shopping" fromYear={fromYear.year()} toYear={toYear.year()} width={300} height={150} />   
        </Stack> 
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analysis;
