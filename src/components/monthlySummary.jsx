import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import TagSummary from "../graphs/Tag/tag-summary";
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseYearlyAllMonthlyBarStacked from "../graphs/expense-yearly-all-monthly-bar-stacked";
import ExpenseMonthlyCategory from "../graphs/Category/expense-monthly-category"
import ExpenseTable from "../graphs/expense-monthly-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

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

function MonthlySummary() {
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
    <Box sx={{ flexGrow: 1 }}>
      <Paper style={{width:"200px"}}> 
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['month', 'year']}
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
      </Paper>
      <Grid container spacing={1}>
        <Grid xs={4}>
          <Stack direction="row" spacing={2}>
          <ExpenseTable  selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setTagData={setTagData}>  
          </ExpenseTable>
          </Stack>
          <Stack direction="row" spacing={2}>
          <StyledPaper >
            <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={400} height={200} />         
           </StyledPaper> 
          </Stack>
          
        </Grid>
        <Grid xs={5}>
        <TagSummary tag={tagData} selectedYear={selectedYear} selectedMonth={selectedMonth} > </TagSummary>
        </Grid>
        <Grid xs={3}>
        <Stack>
        <ExpenseMonthlyCategory category="Outside Food" selectedYear={selectedYear} width={300} height={150} />  
        <ExpenseMonthlyCategory category="Groceries" selectedYear={selectedYear} width={300} height={150} />         
        <ExpenseMonthlyCategory category="Transportation" selectedYear={selectedYear} width={300} height={150} />         
        <ExpenseMonthlyCategory category="Takeway" selectedYear={selectedYear} width={300} height={150} />         
        <ExpenseMonthlyCategory category="Shopping" selectedYear={selectedYear} width={300} height={150} />         
        </Stack> 
        </Grid>
      </Grid>
    </Box>
  );
}

export default MonthlySummary;
