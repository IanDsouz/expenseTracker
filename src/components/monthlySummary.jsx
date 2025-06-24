import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import TagSummaryModal from "../graphs/tag/tag-summary";
import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseMonthlyCategory from "../graphs/category/expense-monthly-category"
import ExpenseTable from "../graphs/expense-monthly-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function MonthlySummary() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(dayjs().date(1));
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagData, setTagData] = useState(null);

  const handleMonthChange = (date) => {
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
  };

  return (
    <Box sx={{ flexGrow: 1, p: 1}} >
         <Paper style={{width:"150px"}}> 
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['month', 'year']}
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
      <Grid container spacing={2}>
        <Grid size={4}>
        <ExpenseTable 
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onTagClick={(tag) => {
            setTagData(tag);
            setIsTagModalOpen(true);
          }}
          />
        </Grid>
        <Grid size={2}>
        <ExpenseMonthlyCategory category="Outside Food" selectedYear={selectedYear} width={250} height={130} />  
        <ExpenseMonthlyCategory category="Takeway" selectedYear={selectedYear} width={250} height={130} />                  
        <ExpenseMonthlyCategory category="Car" selectedYear={selectedYear} width={250} height={130} /> 
        <ExpenseMonthlyCategory category="Tech" selectedYear={selectedYear} width={250} height={130} />
        </Grid>
        <Grid size={2}>
        <ExpenseMonthlyCategory category="Groceries" selectedYear={selectedYear} width={250} height={130} />  
        <ExpenseMonthlyCategory category="Shopping" selectedYear={selectedYear} width={250} height={130} />                   
        <ExpenseMonthlyCategory category="Transportation" selectedYear={selectedYear} width={250} height={130} />  
        <ExpenseMonthlyCategory category="Hotel" selectedYear={selectedYear} width={250} height={130} /> 
        </Grid>
        <Grid size={4}>
        <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={400} height={200} />
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
      </Grid>
      <TagSummaryModal
          open={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          tag={tagData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
    </Box>
  ); 
}

export default MonthlySummary;
