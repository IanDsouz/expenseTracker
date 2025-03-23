import React, { useState } from "react";
import { Box, Typography, Card, CardContent, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Grid from '@mui/material/Grid2'; 

// Import your graph components
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseYearlyGraph from "../graphs/expense-yearly";
import ExpenseYearlyAllMonthlyBarStacked from "../graphs/expense-yearly-all-monthly-bar-stacked";

import FinancialSummaryGraph from "../graphs/saving/yearly-saving"

function DashboardSaved() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedDate, setSelectedDate] = useState(dayjs().date(1));

  const handleMonthChange = (date) => {
    setSelectedDate(date);
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <Typography variant="subtitle1">Get a quick overview of your finances.</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year"]}
            label="Year"
            value={selectedDate}
            onChange={handleMonthChange}
            inputFormat="yyyy"
            minDate={dayjs("2018-01-01")}
            maxDate={dayjs()}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" sx={{ width: 150 }} />
            )}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ flexGrow: 1 }} >
      <Grid container spacing={1}>
      <Grid size={5}>
        <Card>
                <CardContent>
                <FinancialSummaryGraph selectedYear={selectedYear} width={500} height={250} />
                </CardContent>
            </Card>
        </Grid>
        <Grid size={3}>
        <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Expense Breakdown
              </Typography>
              <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={2}>
        <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Income vs Expenses
              </Typography>
              <ExpenseYearlyAllMonthlyBarStacked selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={2}>
        <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Expenses by Category (Stacked)
              </Typography>
              <ExpenseYearlyAllMonthlyBarStacked selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={8}>
          <p>size=8</p>
        </Grid>
        <Grid size={4}>
          <p>size=4</p>
        </Grid>  
      </Grid>
      </Box>
    
    </Box>
  );
}

export default DashboardSaved;
