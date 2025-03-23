import React, { useState } from "react";
import { Box, Grid, Typography, Card, CardContent, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Import your graph components
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseYearlyGraph from "../graphs/expense-yearly";
import ExpenseYearlyAllMonthlyBarStacked from "../graphs/expense-yearly-all-monthly-bar-stacked";
import MonthlyIncomeExpenseChart from "../graphs/expense/dashboard-expense-monthly";
import ExpenseIncomeUI from "../graphs/expense/expense-income-ui"

function Summary() {
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

      {/* Dashboard Layout */}
      <Grid container spacing={1}>
        {/* Row 1 */}
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Yearly Expense Breakdown
              </Typography>
              <ExpenseYearlyGraph selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Expense Breakdown
              </Typography>
              <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Expenses by Category (Stacked)
              </Typography>
              <ExpenseYearlyAllMonthlyBarStacked selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Monthly Income vs Expenses
              </Typography>
              <ExpenseYearlyAllMonthlyBarStacked selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>

        {/* Row 2 */}
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Income Sources Breakdown
              </Typography>
              <ExpenseIncomeUI selectedYear={selectedYear} width={300} height={150} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Top Spending Categories
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Savings Progress
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Upcoming Recurring Expenses
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Row 3 */}
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Yearly Income Breakdown
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Expense Trends Over Years
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Expense by Payment Method
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Budget vs Actual Spending
              </Typography>
              <Box sx={{ width: "100%", height: 150, backgroundColor: "#f5f5f5" }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Summary;
