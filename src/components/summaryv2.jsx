import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import ExpenseGraphHorizontal from "../graphs/expense-horizontal";
import TagSummary from "../graphs/tag/tag-summary";
import ExpenseYearlyGraph from "../graphs/expense-yearly";
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseTable from "../graphs/expense-monthly-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


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


function SummaryV2() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(dayjs().date(1));
  const [tagData, setTagData] = useState(null);

  const handleMonthChange = (date) => {
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
  };

  return (
    <div>
      <p></p>
      <div style={{ textAlign: "left" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month"]}
            label="Select Month and Year"
            value={selectedDate}
            onChange={handleMonthChange}
            inputFormat="MM/yyyy"
            minDate={dayjs("2018-01-01")}
            maxDate={dayjs()}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </LocalizationProvider>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ExpenseTable
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setTagData={setTagData}
            />
          </Grid>
          <Grid item xs={6}>
          <TagSummary  tag={tagData} selectedYear={selectedYear} selectedMonth={selectedMonth}  />
            
            {/* <ExpenseGraphHorizontal selectedYear={selectedYear} selectedMonth={selectedMonth} /> */}
          </Grid>
          <Grid item xs={6}>
            <ExpenseYearlyGraph  selectedYear={selectedYear} />
          </Grid>
          <Grid item xs={6}>
          <ExpenseYearMonthlyGraph selectedYear={selectedYear} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );

}

export default SummaryV2;
