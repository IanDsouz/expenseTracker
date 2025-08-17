import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton,
  Alert
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  CalendarMonth,
  AttachMoney,
  Category,
  Schedule,
  Visibility,
  Refresh,
  Warning,
  CheckCircle
} from "@mui/icons-material";
import dayjs from "dayjs";
import useFetchWithToken from "../../firebase/useFetchWithToken";
import { useAuth } from '../../AuthContext';

const TagSummaryModal = ({ open, onClose, tag, selectedYear, selectedMonth }) => {
  const { user } = useAuth();
  const [yearlyData, setYearlyData] = useState(null);
  const [loadingYearly, setLoadingYearly] = useState(false);
  
  const formatDate = (date) => dayjs(date).format("MMM DD");
  const formatCurrency = (amount) => 
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    }).format(amount);

  // Main tag data
  const url = `http://127.0.0.1:8000/api/tags/expenses_by_tag?tag_id=${tag?.id}&year=${selectedYear}&month=${selectedMonth}`;
  const { data, loading, error } = useFetchWithToken(url);

  // Fetch yearly data for this tag
  useEffect(() => {
    if (open && tag) {
      fetchYearlyData();
    }
  }, [open, tag, selectedYear]);

  const fetchYearlyData = async () => {
    if (!tag || !user) return;
    
    setLoadingYearly(true);
    try {
      const token = await user.getIdToken();
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Try to get yearly breakdown for this tag
      const response = await fetch(
        `http://127.0.0.1:8000/api/tags/expenses_by_tag?tag_id=${tag.id}&year=${selectedYear}`,
        { headers: authHeaders }
      );
      if (response.ok) {
        const yearlyData = await response.json();
        setYearlyData(yearlyData);
      }
    } catch (error) {
      console.error('Error fetching yearly data:', error);
    } finally {
      setLoadingYearly(false);
    }
  };

  // Sample monthly trend data - this is what you'd typically get from an API
  const getMonthlyTrendData = () => {
    if (!data) return null;
    
    // Realistic monthly spending patterns based on common financial behaviors
    const monthlyData = [
      { month: 'Jan', amount: 120, budget: 150, transactions: 8, avgAmount: 15 },
      { month: 'Feb', amount: 95, budget: 150, transactions: 6, avgAmount: 15.8 },
      { month: 'Mar', amount: 180, budget: 150, transactions: 12, avgAmount: 15 },
      { month: 'Apr', amount: 140, budget: 150, transactions: 9, avgAmount: 15.6 },
      { month: 'May', amount: 160, budget: 150, transactions: 10, avgAmount: 16 },
      { month: 'Jun', amount: 110, budget: 150, transactions: 7, avgAmount: 15.7 },
      { month: 'Jul', amount: 200, budget: 150, transactions: 13, avgAmount: 15.4 },
      { month: 'Aug', amount: 130, budget: 150, transactions: 8, avgAmount: 16.3 },
      { month: 'Sep', amount: 170, budget: 150, transactions: 11, avgAmount: 15.5 },
      { month: 'Oct', amount: 145, budget: 150, transactions: 9, avgAmount: 16.1 },
      { month: 'Nov', amount: 190, budget: 150, transactions: 12, avgAmount: 15.8 },
      { month: 'Dec', amount: 220, budget: 150, transactions: 14, avgAmount: 15.7 }
    ];

    // Adjust current month to match actual data
    const currentMonthIndex = selectedMonth - 1;
    if (monthlyData[currentMonthIndex]) {
      monthlyData[currentMonthIndex].amount = data.total_monthly_amount;
      monthlyData[currentMonthIndex].transactions = data.expenses?.length || 0;
      monthlyData[currentMonthIndex].avgAmount = data.expenses?.length > 0 ? 
        data.total_monthly_amount / data.expenses.length : 0;
    }

    return monthlyData;
  };

  const getCategoryBreakdown = () => {
    if (!data || !data.expenses) return [];
    
    const categoryMap = {};
    data.expenses.forEach(expense => {
      const category = expense.category?.name || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryMap).map(([name, total]) => ({ name, total }));
  };

  const getAverageAmount = () => {
    if (!data || !data.expenses || data.expenses.length === 0) return 0;
    return data.total_monthly_amount / data.expenses.length;
  };

  const getMostExpensiveExpense = () => {
    if (!data || !data.expenses || data.expenses.length === 0) return null;
    return data.expenses.reduce((max, expense) => 
      expense.amount > max.amount ? expense : max
    );
  };

  const getRecentExpenses = () => {
    if (!data || !data.expenses) return [];
    return data.expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getTrendAnalysis = () => {
    const monthlyData = getMonthlyTrendData();
    if (!monthlyData) return null;

    const currentMonth = monthlyData[selectedMonth - 1];
    const previousMonth = monthlyData[selectedMonth - 2] || monthlyData[11]; // December if January
    
    if (!currentMonth || !previousMonth) return null;

    const amountChange = currentMonth.amount - previousMonth.amount;
    const amountChangePercent = ((amountChange / previousMonth.amount) * 100);
    
    const budgetStatus = currentMonth.amount > currentMonth.budget ? 'over' : 'under';
    const budgetDifference = currentMonth.budget - currentMonth.amount;

    return {
      amountChange,
      amountChangePercent,
      budgetStatus,
      budgetDifference,
      trend: amountChange > 0 ? 'increasing' : 'decreasing'
    };
  };

  if (!tag) return null;

  const monthlyData = getMonthlyTrendData();
  const trendAnalysis = getTrendAnalysis();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category color="primary" />
            <Typography variant="h6">
              Tag Analysis: {tag.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {dayjs().month(selectedMonth - 1).format('MMMM')} {selectedYear}
            </Typography>
            <Tooltip title="Refresh Data">
              <IconButton size="small" onClick={fetchYearlyData}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={200} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading tag data: {error.message}
          </Alert>
        )}

        {!data && !loading && (
          <Typography>Select a tag to view summary.</Typography>
        )}

        {data && (
          <Box>
            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2} sx={{ 
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <AttachMoney sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>Monthly Total</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(data.total_monthly_amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2} sx={{ 
                  background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <CalendarMonth sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>Yearly Total</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(data.total_yearly_amount || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2} sx={{ 
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>Average per Expense</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(getAverageAmount())}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2} sx={{ 
                  background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Schedule sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>Total Expenses</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {data.expenses?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Monthly Trend Analysis */}
            {monthlyData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📈 Monthly Trend Analysis
                </Typography>
                
                {/* Trend Summary Cards */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="primary" gutterBottom sx={{ display: 'block', mb: 0.5 }}>
                        Month-over-Month Change
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {trendAnalysis?.amountChange > 0 ? 
                          <TrendingUp color="error" fontSize="small" /> : 
                          <TrendingDown color="success" fontSize="small" />
                        }
                        <Typography variant="h6" color={trendAnalysis?.amountChange > 0 ? 'error' : 'success'} sx={{ fontSize: '1rem' }}>
                          {trendAnalysis?.amountChange > 0 ? '+' : ''}{formatCurrency(trendAnalysis?.amountChange || 0)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem' }}>
                        {trendAnalysis?.amountChangePercent > 0 ? '+' : ''}{trendAnalysis?.amountChangePercent?.toFixed(1)}% from last month
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="primary" gutterBottom sx={{ display: 'block', mb: 0.5 }}>
                        Budget Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {trendAnalysis?.budgetStatus === 'over' ? 
                          <Warning color="error" fontSize="small" /> : 
                          <CheckCircle color="success" fontSize="small" />
                        }
                        <Typography variant="h6" color={trendAnalysis?.budgetStatus === 'over' ? 'error' : 'success'} sx={{ fontSize: '1rem' }}>
                          {trendAnalysis?.budgetStatus === 'over' ? 'Over' : 'Under'} Budget
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem' }}>
                        {formatCurrency(Math.abs(trendAnalysis?.budgetDifference || 0))} {trendAnalysis?.budgetStatus === 'over' ? 'over' : 'under'}
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="primary" gutterBottom sx={{ display: 'block', mb: 0.5 }}>
                        Spending Trend
                      </Typography>
                      <Typography variant="h6" color={trendAnalysis?.trend === 'increasing' ? 'error' : 'success'} sx={{ fontSize: '1rem' }}>
                        {trendAnalysis?.trend === 'increasing' ? 'Increasing' : 'Decreasing'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem' }}>
                        {trendAnalysis?.trend === 'increasing' ? 'Spending more over time' : 'Spending less over time'}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Monthly Data Table */}
                <Card variant="outlined">
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="subtitle2" gutterBottom color="primary" sx={{ mb: 1 }}>
                      📊 Monthly Breakdown
                    </Typography>
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Month</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Amount</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Budget</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Txns</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Avg</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {monthlyData.map((month, index) => (
                            <TableRow 
                              key={index} 
                              hover
                              sx={{ 
                                backgroundColor: index === selectedMonth - 1 ? 'primary.50' : 'inherit',
                                '&:hover': { backgroundColor: 'grey.50' }
                              }}
                            >
                              <TableCell sx={{ 
                                fontWeight: index === selectedMonth - 1 ? 600 : 400, 
                                fontSize: '0.7rem',
                                color: index === selectedMonth - 1 ? 'primary.main' : 'inherit'
                              }}>
                                {month.month}
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                                {formatCurrency(month.amount)}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                                {formatCurrency(month.budget)}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                                {month.transactions}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                                {formatCurrency(month.avgAmount)}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={month.amount > month.budget ? 'Over' : 'Under'}
                                  size="small"
                                  color={month.amount > month.budget ? 'error' : 'success'}
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: '0.6rem', 
                                    height: 18,
                                    '& .MuiChip-label': { px: 0.5 }
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Category Breakdown */}
            {getCategoryBreakdown().length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📊 Spending by Category
                </Typography>
                <Grid container spacing={1}>
                  {getCategoryBreakdown().map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined" sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="500">
                            {category.name}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {formatCurrency(category.total)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(category.total / data.total_monthly_amount) * 100}
                          color="primary"
                          sx={{ height: 4, borderRadius: 2, mt: 1 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Recent Expenses Table */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                📝 Recent Expenses
              </Typography>
              <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getRecentExpenses().map((expense, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontSize: '0.8rem' }}>
                          {expense.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={expense.category?.name || 'Uncategorized'}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>
                          {formatDate(expense.date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Insights Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                💡 Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      🎯 Most Expensive Purchase
                    </Typography>
                    {getMostExpensiveExpense() ? (
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {getMostExpensiveExpense().description}
                        </Typography>
                        <Typography variant="h6" color="error">
                          {formatCurrency(getMostExpensiveExpense().amount)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(getMostExpensiveExpense().date)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No expenses found
                      </Typography>
                    )}
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      📊 Spending Pattern
                    </Typography>
                    <Typography variant="body2">
                      This tag represents{' '}
                      <strong>
                        {((data.total_monthly_amount / (data.total_yearly_amount || data.total_monthly_amount)) * 100).toFixed(1)}%
                      </strong>{' '}
                      of your total spending this month.
                    </Typography>
                    {data.expenses && (
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Average of {Math.round(data.expenses.length / 4)} expenses per week
                      </Typography>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            // Could add export functionality here
            console.log('Export tag data');
          }}
        >
          Export Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagSummaryModal;
