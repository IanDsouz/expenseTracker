import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TagSummary from "../graphs/tag/tag-summary";
import ExpenseMonthlyCategory from "../graphs/category/expense-monthly-category"
import ExpenseTable from "../graphs/expense-monthly-table";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useFetchWithToken from '../firebase/useFetchWithToken';



function MonthlySummary() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate] = useState(dayjs().date(1));
  const [tagData, setTagData] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const handleMonthChange = (date) => {
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
  };

  // Fetch categories using authenticated API call
  const { data: categories, loading: loadingCategories, error: categoriesError } = useFetchWithToken('http://127.0.0.1:8000/api/categories/');

  // Fallback categories if API fails
  const fallbackCategories = [
    { id: 1, name: 'Outside Food' },
    { id: 2, name: 'Groceries' },
    { id: 3, name: 'Transportation' },
    { id: 4, name: 'Takeway' },
    { id: 5, name: 'Shopping' }
  ];

  const displayCategories = categories || (categoriesError ? fallbackCategories : []);

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
                     <ExpenseTable  
               selectedYear={selectedYear}
               selectedMonth={selectedMonth}
               setTagData={(tag) => {
                 setTagData(tag);
                 setIsTagModalOpen(true);
               }}
           />
          </Stack>
          <Stack direction="row" spacing={2}>
          {/* <StyledPaper >
            <ExpenseYearMonthlyGraph selectedYear={selectedYear} width={400} height={200} />         
           </StyledPaper>  */}
          </Stack>
        </Grid>
                 <Grid xs={5}>
         {/* TagSummary will appear as modal when tag is clicked */}
         </Grid>
        <Grid xs={3}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600 }}>
              Category Trends
            </Typography>
            {loadingCategories ? (
              <Typography variant="body2" color="text.secondary">
                Loading categories...
              </Typography>
            ) : (
              displayCategories.slice(0, 6).map((category) => (
                <Paper key={category.id} sx={{ p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>
                    {category.name}
                  </Typography>
                  <ExpenseMonthlyCategory 
                    category={category.name} 
                    selectedYear={selectedYear} 
                    selectedMonth={selectedMonth} 
                    width="100%" 
                    height={80} 
                  />
                </Paper>
              ))
            )}
          </Stack> 
        </Grid>
       </Grid>

       {/* Tag Summary Modal */}
       <TagSummary
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