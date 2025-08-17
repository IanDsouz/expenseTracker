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
  LinearProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Savings,
  AccountBalance,
  Timeline,
  Flag,
  Calculate,
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
  Search,
  AccountBalanceWallet,
  AccountTree,
  Future,
  Goal,
  TrendingUpOutlined,
  TrendingDownOutlined,
  CheckCircle,
  Warning,
  Info
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Import existing components and graphs

import ExpenseYearMonthlyGraph from "../graphs/expense-year-monthly";

import ExpenseIncomeUI from "../graphs/expense/expense-income-ui";

// Mock data for demonstration (replace with real API calls)
const mockSavingsData = {
  currentSavings: 12500,
  monthlySavingsRate: 850,
  yearlySavingsRate: 10200,
  savingsGrowth: 15.2,
  investmentReturns: 8.5,
  emergencyFund: 5000,
  emergencyFundTarget: 10000,
  savingsGoals: [
    { name: "House Down Payment", target: 50000, current: 25000, priority: "High" },
    { name: "Emergency Fund", target: 10000, current: 5000, priority: "High" },
    { name: "Vacation Fund", target: 5000, current: 2000, priority: "Medium" },
    { name: "Investment Portfolio", target: 100000, current: 15000, priority: "Medium" }
  ],
  investmentPortfolio: {
    totalValue: 15000,
    monthlyContribution: 500,
    expectedReturn: 8.5,
    riskLevel: "Moderate"
  },
  savingsOpportunities: [
    { category: "Outside Food", currentSpending: 300, potentialSavings: 150, difficulty: "Easy" },
    { category: "Shopping", currentSpending: 200, potentialSavings: 100, difficulty: "Medium" },
    { category: "Transportation", currentSpending: 150, potentialSavings: 75, difficulty: "Hard" }
  ]
};

function DashboardSaved() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingsData, setSavingsData] = useState(mockSavingsData);

  const handleYearChange = (date) => {
    setSelectedYear(date.year());
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getSavingsColor = (value) => {
    if (value > 0) return "success.main";
    if (value < 0) return "error.main";
    return "text.secondary";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "success";
      case "Medium": return "warning";
      case "Hard": return "error";
      default: return "default";
    }
  };

  const calculateGoalProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateYearsToGoal = (target, current, monthlySavings) => {
    if (monthlySavings <= 0) return "∞";
    const remaining = target - current;
    const months = remaining / monthlySavings;
    return (months / 12).toFixed(1);
  };

  const calculateFutureValue = (principal, monthlyContribution, annualReturn, years) => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const futureValue = principal * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    return futureValue;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* Header Section */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              💰 Savings & Investment Dashboard
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Track your savings progress, set investment goals, and plan for financial growth
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={loading} size="small">
                <Refresh sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
              <IconButton size="small">
                <Download sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Year Selection */}
        <Paper sx={{ p: 0.5, mb: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="caption" gutterBottom>
                <CalendarMonth sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '0.8rem' }} />
                Analysis Year
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year']}
                  label="Select Year"
                  value={dayjs().year(selectedYear)}
                  onChange={handleYearChange}
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

      {/* Tabs for Different Views */}
      <Paper sx={{ mb: 1 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth" size="small" sx={{ minHeight: '40px' }}>
          <Tab label="Overview" icon={<Savings sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Goals" icon={<Flag sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Investments" icon={<AccountTree sx={{ fontSize: '0.9rem' }} />} />
          <Tab label="Opportunities" icon={<TrendingUp sx={{ fontSize: '0.9rem' }} />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={1}>
          {/* Key Savings Metrics */}
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <AccountBalanceWallet color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Current Savings
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.25 }}>
                  £{savingsData.currentSavings.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  Total accumulated savings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <TrendingUp color="success" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="success.main" fontWeight="medium" fontSize="0.7rem">
                    Monthly Savings
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main" sx={{ mb: 0.25 }}>
                  £{savingsData.monthlySavingsRate}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  Average monthly savings
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
                    Savings Growth
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color={getSavingsColor(savingsData.savingsGrowth)} sx={{ mb: 0.25 }}>
                  +{savingsData.savingsGrowth}%
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
                  <ShowChart color="primary" sx={{ mr: 0.25, fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="primary" fontWeight="medium" fontSize="0.7rem">
                    Investment Returns
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main" sx={{ mb: 0.25 }}>
                  {savingsData.investmentReturns}%
                </Typography>
                <Typography variant="caption" color="textSecondary" fontSize="0.6rem">
                  Annual return rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Fund Status */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🚨 Emergency Fund Status
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h6" fontWeight="bold">
                    £{savingsData.emergencyFund.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    of £{savingsData.emergencyFundTarget.toLocaleString()} target
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateGoalProgress(savingsData.emergencyFund, savingsData.emergencyFundTarget)} 
                  color={savingsData.emergencyFund >= savingsData.emergencyFundTarget ? "success" : "warning"}
                  sx={{ height: 6 }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                  {savingsData.emergencyFund >= savingsData.emergencyFundTarget 
                    ? "✅ Emergency fund fully funded!" 
                    : `Need £${(savingsData.emergencyFundTarget - savingsData.emergencyFund).toLocaleString()} more`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Savings Projection */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📈 5-Year Savings Projection
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                    £{calculateFutureValue(
                      savingsData.currentSavings,
                      savingsData.monthlySavingsRate,
                      savingsData.investmentReturns,
                      5
                    ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Projected value in 5 years with {savingsData.investmentReturns}% returns
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Financial Summary */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📊 Financial Summary & Trends
                </Typography>
                <Box sx={{ width: "100%", height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Financial Summary Graph</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Income vs Expenses */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  💰 Income vs Expenses
                </Typography>
                <ExpenseIncomeUI selectedYear={selectedYear} width="100%" height={200} />
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Breakdown */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📅 Monthly Expense Breakdown
                </Typography>
                <ExpenseYearMonthlyGraph selectedYear={selectedYear} width="100%" height={200} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={1}>
          {/* Savings Goals Overview */}
          <Grid item xs={12}>
            <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5, display: 'block' }}>
              🎯 Your Savings Goals
            </Typography>
          </Grid>

          {savingsData.savingsGoals.map((goal, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {goal.name}
                    </Typography>
                    <Chip label={goal.priority} color={getPriorityColor(goal.priority)} size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Progress: £{goal.current.toLocaleString()} / £{goal.target.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="primary" fontWeight="medium">
                      {calculateGoalProgress(goal.current, goal.target).toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateGoalProgress(goal.current, goal.target)} 
                    color={goal.current >= goal.target ? "success" : "primary"}
                    sx={{ height: 4, mb: 0.5 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      Remaining: £{(goal.target - goal.current).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {calculateYearsToGoal(goal.target, goal.current, savingsData.monthlySavingsRate)} years to goal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Goal Achievement Timeline */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  ⏰ Goal Achievement Timeline
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {savingsData.savingsGoals
                    .filter(goal => goal.current < goal.target)
                    .sort((a, b) => {
                      const yearsA = parseFloat(calculateYearsToGoal(a.target, a.current, savingsData.monthlySavingsRate));
                      const yearsB = parseFloat(calculateYearsToGoal(b.target, b.current, savingsData.monthlySavingsRate));
                      return yearsA - yearsB;
                    })
                    .map((goal, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, p: 0.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight="medium">
                          {goal.name}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {calculateYearsToGoal(goal.target, goal.current, savingsData.monthlySavingsRate)} years
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={1}>
          {/* Investment Portfolio Overview */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📊 Investment Portfolio
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Current Value</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      £{savingsData.investmentPortfolio.totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Monthly Contribution</Typography>
                    <Typography variant="body2">
                      £{savingsData.investmentPortfolio.monthlyContribution}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Expected Return</Typography>
                    <Typography variant="body2" color="success.main">
                      {savingsData.investmentPortfolio.expectedReturn}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Risk Level</Typography>
                    <Chip label={savingsData.investmentPortfolio.riskLevel} color="warning" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Investment Projections */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🚀 Investment Projections
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {[5, 10, 15, 20].map((years) => (
                    <Box key={years} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, p: 0.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption">{years} years</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        £{calculateFutureValue(
                          savingsData.investmentPortfolio.totalValue,
                          savingsData.investmentPortfolio.monthlyContribution,
                          savingsData.investmentPortfolio.expectedReturn,
                          years
                        ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Investment Strategy Recommendations */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  💡 Investment Strategy Recommendations
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'success.50' }}>
                      <Typography variant="caption" color="success.main" gutterBottom fontWeight="medium">
                        ✅ Diversification
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Consider spreading investments across different asset classes for better risk management.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'warning.50' }}>
                      <Typography variant="caption" color="warning.main" gutterBottom fontWeight="medium">
                        ⚠️ Risk Assessment
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Your current risk level is moderate. Consider if this aligns with your long-term goals.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'info.50' }}>
                      <Typography variant="caption" color="info.main" gutterBottom fontWeight="medium">
                        💡 Growth Potential
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        With consistent contributions, you could reach £100k+ in 15-20 years.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={1}>
          {/* Savings Opportunities */}
          <Grid item xs={12}>
            <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5, display: 'block' }}>
              💰 Potential Savings Opportunities
            </Typography>
          </Grid>

          {savingsData.savingsOpportunities.map((opportunity, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {opportunity.category}
                    </Typography>
                    <Chip label={opportunity.difficulty} color={getDifficultyColor(opportunity.difficulty)} size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Current: £{opportunity.currentSpending}
                    </Typography>
                    <Typography variant="caption" color="success.main" fontWeight="medium">
                      Potential: £{opportunity.potentialSavings}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Monthly Savings
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      £{opportunity.potentialSavings}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary">
                    Reduce spending in this category to increase your monthly savings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Total Savings Potential */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  📈 Total Savings Potential
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="h5" color="success.main" fontWeight="bold" gutterBottom>
                    £{savingsData.savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Additional monthly savings potential from all opportunities
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                    This could increase your monthly savings by {(savingsData.savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0) / savingsData.monthlySavingsRate * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Plan */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" gutterBottom color="primary" fontWeight="medium" sx={{ mb: 0.5 }}>
                  🎯 Your Action Plan
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'success.50' }}>
                      <Typography variant="caption" color="success.main" gutterBottom fontWeight="medium">
                        🥇 Start Easy
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Begin with "Outside Food" - reduce by £150/month. This is the easiest win!
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'warning.50' }}>
                      <Typography variant="caption" color="warning.main" gutterBottom fontWeight="medium">
                        🥈 Build Momentum
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Move to "Shopping" - cut £100/month. Look for better deals and alternatives.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 0.5, bgcolor: 'info.50' }}>
                      <Typography variant="caption" color="info.main" gutterBottom fontWeight="medium">
                        🥉 Challenge Yourself
                      </Typography>
                      <Typography variant="caption" fontSize="0.7rem">
                        Finally tackle "Transportation" - save £75/month. Consider carpooling or public transport.
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

export default DashboardSaved;
