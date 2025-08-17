import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
  Divider
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  Savings, 
  AttachMoney,
  Refresh,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useAuth } from '../AuthContext';

// Import existing components and graphs

import ExpenseYearMonthlyGraph from '../graphs/expense-year-monthly';
import ExpenseIncomeUI from '../graphs/expense/expense-income-ui';
import ExpenseMonthlyPie from '../graphs/expense-monthly-pie';

import SavingsComponent from '../components/Savings/SavingsComponent';
import ExpenseTable from '../components/Expense/ExpenseTable';

function DashboardV2() {
  const { user } = useAuth();
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(dayjs().date(1));
  
  // Mock data for demonstration (replace with real API calls)
  const [dashboardData, setDashboardData] = useState({
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    currentMonthSavings: 0,
    yearlyIncome: 0,
    yearlyExpenses: 0,
    yearlySavings: 0,
    topCategories: [],
    recentTransactions: [],
    savingsGoals: [],
    loading: true,
    error: null
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedMonth(date.month() + 1);
    setSelectedYear(date.year());
    fetchDashboardData(date.year(), date.month() + 1);
  };

  const fetchDashboardData = async (year, month) => {
    try {
      if (!user) return;
      
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      const token = await user.getIdToken();
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Fetch current month data
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/incomes/monthly-total/?year=${year}&month=${month}`, {
          headers: authHeaders
        }),
        fetch(`http://127.0.0.1:8000/api/expenses/monthly-total/?year=${year}&month=${month}`, {
          headers: authHeaders
        })
      ]);

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      const monthlyIncome = incomeData.monthly_income_total || 0;
      const monthlyExpenses = expenseData.monthly_expense_total || 0;
      const monthlySavings = monthlyIncome - monthlyExpenses;

      // Fetch yearly data
      const yearlyIncomeResponse = await fetch(`http://localhost:8000/api/incomes/yearly-total/?year=${year}`, {
        headers: authHeaders
      });
      const yearlyExpenseResponse = await fetch(`http://127.0.0.1:8000/api/year_monthly_expense/${year}`, {
        headers: authHeaders
      });
      
      const yearlyIncomeData = await yearlyIncomeResponse.json();
      const yearlyExpenseData = await yearlyExpenseResponse.json();

      const yearlyIncome = yearlyIncomeData.income_total || 0;
      const yearlyExpenses = yearlyExpenseData.total_expense || 0;
      const yearlySavings = yearlyIncome - yearlyExpenses;

      setDashboardData({
        currentMonthIncome: monthlyIncome,
        currentMonthExpenses: monthlyExpenses,
        currentMonthSavings: monthlySavings,
        yearlyIncome,
        yearlyExpenses,
        yearlySavings,
        topCategories: [],
        recentTransactions: [],
        savingsGoals: [],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load dashboard data. Please try again.' 
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData(currentYear, currentMonth);
  }, []);

  const getSavingsColor = (savings) => {
    if (savings >= 0) return 'success';
    if (savings >= -100) return 'warning';
    return 'error';
  };

  const getSavingsIcon = (savings) => {
    if (savings >= 0) return <TrendingUp />;
    return <TrendingDown />;
  };

  if (dashboardData.loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Financial Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DatePicker
                views={['year', 'month']}
                label="Select Period"
                value={selectedDate}
                onChange={handleDateChange}
                inputFormat="MMM yyyy"
                minDate={dayjs('2018-01-01')}
                maxDate={dayjs()}
                renderInput={(params) => (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 1, 
                      display: 'flex', 
                      alignItems: 'center',
                      minWidth: 200
                    }}
                  >
                    {params.input}
                  </Paper>
                )}
              />
              <Tooltip title="Refresh Data">
                <IconButton onClick={() => fetchDashboardData(selectedYear, selectedMonth)}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {dashboardData.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dashboardData.error}
            </Alert>
          )}
        </Box>

        {/* KPI Cards Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Current Month Income */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      Monthly Income
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      £{dashboardData.currentMonthIncome.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                      {dayjs().format('MMMM YYYY')}
                    </Typography>
                  </Box>
                  <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Month Expenses */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      Monthly Expenses
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      £{dashboardData.currentMonthExpenses.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                      {dayjs().format('MMMM YYYY')}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Month Savings */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ 
              background: `linear-gradient(135deg, ${dashboardData.currentMonthSavings >= 0 ? '#2196f3' : '#ff9800'} 0%, ${dashboardData.currentMonthSavings >= 0 ? '#42a5f5' : '#ffb74d'} 100%)`,
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      Monthly Savings
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      £{dashboardData.currentMonthSavings.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {getSavingsIcon(dashboardData.currentMonthSavings)}
                      <Typography variant="body2" sx={{ opacity: 0.8, ml: 0.5 }}>
                        {dashboardData.currentMonthSavings >= 0 ? 'Positive' : 'Negative'}
                      </Typography>
                    </Box>
                  </Box>
                  <Savings sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Yearly Overview */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      Yearly Savings
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      £{dashboardData.yearlySavings.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                      {selectedYear}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Yearly Expense Breakdown */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Yearly Expense Breakdown
                </Typography>
                <Box sx={{ width: "100%", height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Yearly Graph Component</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Trend */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Monthly Expense Trend
                </Typography>
                <ExpenseYearMonthlyGraph selectedYear={selectedYear} width="100%" height={300} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Income vs Expenses Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Income vs Expenses Overview
                </Typography>
                <ExpenseIncomeUI selectedYear={selectedYear} width="100%" height={400} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Row - Category Breakdown and Savings */}
        <Grid container spacing={3}>
          {/* Category Breakdown */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Spending by Category
                </Typography>
                <ExpenseMonthlyPie selectedYear={selectedYear} selectedMonth={selectedMonth} />
              </CardContent>
            </Card>
          </Grid>

          {/* Savings Goals */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Savings Goals
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <SavingsComponent />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Recent Transactions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ExpenseTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default DashboardV2;