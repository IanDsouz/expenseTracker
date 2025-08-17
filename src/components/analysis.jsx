import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Skeleton,
  LinearProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  Insights,
  Assessment,
  Timeline,
  CompareArrows,
  Download,
  Refresh,
  CalendarMonth,
  AttachMoney,
  Category,
  PieChart,
  BarChart,
  ShowChart,
  TableChart,
  FilterList,
  Search
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Import existing graph components

import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";
import ExpenseMonthlyPie from "../graphs/expense-monthly-pie";
import ExpenseIncomeUI from "../graphs/expense/expense-income-ui";
import TagSummary from "../graphs/tag/tag-summary";

// Mock data for demonstration (replace with real API calls)
const mockAnalysisData = {
  spendingTrends: {
    monthlyGrowth: 12.5,
    yearlyGrowth: 8.2,
    averageMonthlySpending: 1250,
    topSpendingMonth: "December",
    lowestSpendingMonth: "February"
  },
  categoryInsights: {
    highestSpending: "Outside Food",
    lowestSpending: "Personal",
    fastestGrowing: "Transportation",
    mostVolatile: "Shopping"
  },
  budgetAnalysis: {
    overBudgetCategories: 3,
    underBudgetCategories: 7,
    totalBudgetUtilization: 87.3,
    savingsRate: 12.7
  },
  seasonalPatterns: {
    peakSeason: "Q4",
    lowSeason: "Q1",
    seasonalVariation: 23.4
  }
};

function Analysis() {
  const currentYear = dayjs().year();
  const [fromYear, setFromYear] = useState(dayjs().year(currentYear - 2));
  const [toYear, setToYear] = useState(dayjs().year(currentYear));
  const [selectedPeriod, setSelectedPeriod] = useState("3Y");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(mockAnalysisData);

  const handleFromYearChange = (date) => {
    setFromYear(date);
  };

  const handleToYearChange = (date) => {
    setToYear(date);
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
    // Auto-adjust year range based on period
    const newFromYear = dayjs().year(currentYear - parseInt(event.target.value));
    setFromYear(newFromYear);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getGrowthColor = (value) => {
    if (value > 0) return "success.main";
    if (value < 0) return "error.main";
    return "text.secondary";
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <TrendingUp />;
    if (value < 0) return <TrendingDown />;
    return null;
  };

  const getBudgetColor = (utilization) => {
    if (utilization > 100) return "error.main";
    if (utilization > 90) return "warning.main";
    return "success.main";
  };

  // Calculate fromDate and toDate
  const fromDate = fromYear.year();
  const toDate = toYear.year();

  const quickPeriods = [
    { label: "1Y", value: "1Y", years: 1 },
    { label: "2Y", value: "2Y", years: 2 },
    { label: "3Y", value: "3Y", years: 3 },
    { label: "5Y", value: "5Y", years: 5 }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* Header Section */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              📊 Financial Analysis Dashboard
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Comprehensive insights into your spending patterns, trends, and financial health
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={loading} size="small">
                <Refresh sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Analysis">
              <IconButton size="small">
                <Download sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Period Selection */}
        <Paper sx={{ p: 0.5, mb: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="caption" gutterBottom>
                <CalendarMonth sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '0.8rem' }} />
                Analysis Period
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Quick Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  label="Quick Period"
                >
                  {quickPeriods.map((period) => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year']}
                  label="From Year"
                  value={fromYear}
                  onChange={handleFromYearChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year']}
                  label="To Year"
                  value={toYear}
                  onChange={handleToYearChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabs for Different Analysis Views */}
      <Paper sx={{ mb: 1 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth" size="small" sx={{ minHeight: '40px' }}>
          <Tab label="Overview" icon={<Analytics sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Trends" icon={<Timeline sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Categories" icon={<Category sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Insights" icon={<Insights sx={{ fontSize: '0.9rem' }} />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={1}>
          {/* Key Metrics Cards */}
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <TrendingUp color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Monthly Growth
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color={getGrowthColor(mockAnalysisData.spendingTrends.monthlyGrowth)} sx={{ mb: 0.25 }}>
                  {mockAnalysisData.spendingTrends.monthlyGrowth > 0 ? '+' : ''}{mockAnalysisData.spendingTrends.monthlyGrowth}%
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  vs. previous month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <ShowChart color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Yearly Growth
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color={getGrowthColor(mockAnalysisData.spendingTrends.yearlyGrowth)} sx={{ mb: 0.25 }}>
                  {mockAnalysisData.spendingTrends.yearlyGrowth > 0 ? '+' : ''}{mockAnalysisData.spendingTrends.yearlyGrowth}%
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  vs. previous year
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <AttachMoney color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Avg Monthly
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.25 }}>
                  £{mockAnalysisData.spendingTrends.averageMonthlySpending}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  spending average
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <PieChart color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Budget Usage
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color={getBudgetColor(mockAnalysisData.budgetAnalysis.totalBudgetUtilization)} sx={{ mb: 0.25 }}>
                  {mockAnalysisData.budgetAnalysis.totalBudgetUtilization}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={mockAnalysisData.budgetAnalysis.totalBudgetUtilization} 
                  color={mockAnalysisData.budgetAnalysis.totalBudgetUtilization > 100 ? "error" : "primary"}
                  sx={{ mt: 0.25, height: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Main Charts */}
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📈 Spending Trends Over Time
                </Typography>
                <ExpenseYearMonthlyGraph selectedYear={currentYear} width="100%" height={200} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🎯 Category Distribution
                </Typography>
                <ExpenseMonthlyPie selectedYear={currentYear} selectedMonth={dayjs().month() + 1} />
              </CardContent>
            </Card>
          </Grid>

          {/* Income vs Expenses */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  💰 Income vs Expenses Overview
                </Typography>
                <ExpenseIncomeUI selectedYear={currentYear} width="100%" height={150} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={1}>
          {/* Trend Analysis */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📊 Yearly Expense Breakdown
                </Typography>
                <Box sx={{ width: "100%", height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Yearly Graph Component</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🔍 Seasonal Patterns
                </Typography>
                <Box sx={{ p: 0.5, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {mockAnalysisData.seasonalPatterns.seasonalVariation}%
                  </Typography>
                  <Typography variant="caption" gutterBottom>
                    Seasonal Variation
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
                    <Box>
                      <Chip label={`Peak: ${mockAnalysisData.seasonalPatterns.peakSeason}`} color="success" size="small" />
                    </Box>
                    <Box>
                      <Chip label={`Low: ${mockAnalysisData.seasonalPatterns.lowSeason}`} color="warning" size="small" />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Trends */}
          <Grid item xs={12}>
            <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.25 }}>
              📈 Category-Specific Trends
            </Typography>
            <Grid container spacing={0.5}>
              <Grid item xs={12} md={4}>
                <Box sx={{ width: "100%", height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Groceries Chart</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ width: "100%", height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Transportation Chart</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ width: "100%", height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Outside Food Chart</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={1}>
          {/* Category Analysis */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🏆 Top Spending Categories
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Highest Spending</Typography>
                    <Chip label={mockAnalysisData.categoryInsights.highestSpending} color="error" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Lowest Spending</Typography>
                    <Chip label={mockAnalysisData.categoryInsights.lowestSpending} color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Fastest Growing</Typography>
                    <Chip label={mockAnalysisData.categoryInsights.fastestGrowing} color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Most Volatile</Typography>
                    <Chip label={mockAnalysisData.categoryInsights.mostVolatile} color="info" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📊 Budget Performance
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Over Budget</Typography>
                    <Chip label={mockAnalysisData.budgetAnalysis.overBudgetCategories} color="error" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Under Budget</Typography>
                    <Chip label={mockAnalysisData.budgetAnalysis.underBudgetCategories} color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" fontSize="0.7rem">Savings Rate</Typography>
                    <Chip label={`${mockAnalysisData.budgetAnalysis.savingsRate}%`} color="primary" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Charts Grid */}
          <Grid item xs={12}>
            <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.25 }}>
              📈 Detailed Category Analysis
            </Typography>
            <Grid container spacing={0.5}>
              <Grid item xs={12} md={3}>
                <Box sx={{ width: "100%", height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Car Chart</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ width: "100%", height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Hotel Chart</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ width: "100%", height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Takeaway Chart</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ width: "100%", height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Shopping Chart</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={1}>
          {/* AI Insights */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 1, py: 0.25 }}>
              <Typography variant="caption" gutterBottom fontWeight="medium">
                🤖 AI-Powered Insights
              </Typography>
              <Typography variant="caption">
                Based on your spending patterns, here are some intelligent recommendations to optimize your finances.
              </Typography>
            </Alert>
          </Grid>

          {/* Spending Insights */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  💡 Spending Optimization
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • Your highest spending month is <strong>{mockAnalysisData.spendingTrends.topSpendingMonth}</strong>
                  </Typography>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • Consider setting stricter budgets for <strong>{mockAnalysisData.categoryInsights.highestSpending}</strong>
                  </Typography>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • You're saving <strong>{mockAnalysisData.budgetAnalysis.savingsRate}%</strong> of your income
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Trend Insights */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📈 Trend Analysis
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • <strong>{mockAnalysisData.categoryInsights.fastestGrowing}</strong> is your fastest-growing expense
                  </Typography>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • Seasonal variation: <strong>{mockAnalysisData.seasonalPatterns.seasonalVariation}%</strong>
                  </Typography>
                  <Typography variant="caption" gutterBottom fontSize="0.7rem">
                    • Budget utilization: <strong>{mockAnalysisData.budgetAnalysis.totalBudgetUtilization}%</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🎯 Actionable Recommendations
                </Typography>
                <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'success.50' }}>
                      <Typography variant="caption" color="success.main" gutterBottom fontWeight="medium">
                        ✅ What's Working
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        You're maintaining a healthy savings rate and staying mostly within budget. Keep up the good work!
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'warning.50' }}>
                      <Typography variant="caption" color="warning.main" gutterBottom fontWeight="medium">
                        ⚠️ Areas to Watch
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Monitor your {mockAnalysisData.categoryInsights.fastestGrowing} expenses and consider setting limits.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'info.50' }}>
                      <Typography variant="caption" color="info.main" gutterBottom fontWeight="medium">
                        💡 Opportunities
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Plan ahead for {mockAnalysisData.seasonalPatterns.peakSeason} when spending typically increases.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}
    </Container>
  );
}

export default Analysis;
