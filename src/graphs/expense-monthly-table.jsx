import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { styled } from "@mui/material/styles";

// Utility for formatting currency
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);

// Styled table header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
  cursor: "pointer",
}));

const ExpenseTable = ({ selectedYear, selectedMonth, setTagData }) => {
  const [data, setData] = useState(null); // Store API response
  const [rows, setRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/expense_summary/${selectedYear}/${selectedMonth}`
      )
      .then((response) => {
        setData(response.data); // Store entire response
        setRows(
          response.data.expenses.map((expense) => ({
            name: expense.name,
            total: expense.total,
            plannedExpense: expense.planned_expense,
            difference: expense.planned_expense - expense.total,
            expenses: expense.expenses,
          }))
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedYear, selectedMonth]);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getDifferenceColor = (difference, plannedExpense) => {
    const actualSpent = plannedExpense - difference; // Convert difference to actual amount spent
    const spendingRatio =  (actualSpent / plannedExpense) * 100; // Percentage of budget used

    if(difference === 0) return "green";

    if(difference < 0)
    {
      if(spendingRatio > 110)
      {
        return "red";
      }
      return "maroon"
    }

    if (difference > 0 & spendingRatio >= 50)  return "orange";// Between 50% and 100% of the budget (warning)

    return "green"; // Well under 50% of the budget
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  if (!data) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

  return (
<TableContainer component={Paper} sx={{ maxHeight: 450 }}>
  <Table stickyHeader size="small">
    <TableHead>
      <TableRow>
        <StyledTableCell onClick={() => handleSort("name")}>
          Category{" "}
          {sortBy === "name" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
        </StyledTableCell>
        <StyledTableCell align="right" onClick={() => handleSort("plannedExpense")}>
          Planned{" "}
          {sortBy === "plannedExpense" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
        </StyledTableCell>
        <StyledTableCell align="right" onClick={() => handleSort("total")}>
          Actual{" "}
          {sortBy === "total" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
        </StyledTableCell>
        <StyledTableCell align="right" onClick={() => handleSort("difference")}>
          Difference{" "}
          {sortBy === "difference" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
        </StyledTableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {/* Total Row */}
      <TableRow sx={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
        <TableCell>Totals</TableCell>
        <TableCell align="right">{formatCurrency(data.planned_budget)}</TableCell>
        <TableCell align="right">{formatCurrency(data.total_expense)}</TableCell>
        <TableCell align="right" sx={{ color: getDifferenceColor((data.planned_budget - data.total_expense), data.planned_budget) }}>
          {formatCurrency(data.planned_budget - data.total_expense)}
        </TableCell>
      </TableRow>

      {sortedRows.map((row, index) => (
        <React.Fragment key={index}>
          <TableRow sx={{ cursor: "pointer" }} onClick={() => handleRowClick(index)}>
            <TableCell sx={{ width: "25%" }}>
              <Typography sx={{ marginLeft: 1, fontSize: "0.8rem" }}>{row.name}</Typography>
            </TableCell>
            <TableCell align="right" sx={{ width: "25%" }}>
              {formatCurrency(row.plannedExpense)}
            </TableCell>
            <TableCell align="right" sx={{ width: "25%" }}>
              {formatCurrency(row.total)}
            </TableCell>
            <TableCell align="right" sx={{ width: "25%", color: getDifferenceColor(row.difference, row.plannedExpense) }}>
              {formatCurrency(row.difference)}
            </TableCell>
          </TableRow>

          {/* Expandable Row */}
          <TableRow>
            <TableCell colSpan={4} sx={{ p: 0 }}>
              <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                <Box m={0.5}>
                  <Table size="small" sx={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
                    <TableBody>
                      {row.expenses.map((expense, idx) => (
                        <TableRow key={idx} sx={{ fontSize: "0.75rem", padding: 0, border: "none" }}>
                          <TableCell sx={{ p: 0.5, fontSize: "0.75rem", border: "none" }}>
                            {expense.description}
                          </TableCell>
                          <TableCell
                            onClick={() => setTagData(expense.tag)}
                            sx={{ p: 0.5, border: "none" }}
                          >
                            <Chip
                              label={expense.tag.name}
                              size="small"
                              color="primary"
                              sx={{
                                cursor: "pointer",
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ p: 0.5, fontSize: "0.75rem", border: "none" }}>
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>
  );
};

export default ExpenseTable;
