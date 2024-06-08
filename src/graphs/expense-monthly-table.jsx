import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses }  from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Chip from '@mui/material/Chip';
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 100,
  },
}));

const ExpenseTable = ({ selectedYear, selectedMonth, setTagData }) => {
  const displayMonth = dayjs(`${selectedYear}-${selectedMonth}`);
  const [data, setData] = useState(null);
  const [rows, setRows] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  function createData(name, total, plannedExpense, expenses) {
    return { name, total, plannedExpense, expenses };
  }
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/expense_summary/${selectedYear}/${selectedMonth}`
      )
      .then((response) => {
        const rows = response.data.expenses.map((expense) =>
          createData(
            expense.name,
            expense.total,
            expense.planned_expense,
            expense.expenses
          )
        );
        setRows(rows);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedYear, selectedMonth]);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // If already sorted by this column, reverse the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new column, set it as the sort column and default to ascending order
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  let sortedRows = [];

  if (rows) {
    sortedRows = [...rows];
    if (sortBy) {
      sortedRows.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400 } } >
      <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
            <StyledTableCell onClick={() => handleSort("name")}>
            Category{" "}
            {sortBy === "name" && (
                <span>
                {sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                ) : (
                    <ArrowDownwardIcon />
                )}
                </span>
            )}
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("plannedExpense")}>
            Planned Expense{" "}
            {sortBy === "plannedExpense" && (
                <span>
                {sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                ) : (
                    <ArrowDownwardIcon />
                )}
                </span>
            )}
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => handleSort("total")}>
            Actual{" "}
            {sortBy === "total" && (
                <span>
                {sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                ) : (
                    <ArrowDownwardIcon />
                )}
                </span>
            )}
            </StyledTableCell>
            <StyledTableCell
            align="right"
            onClick={() => handleSort("plannedExpense - total")}
            >
            Diff{" "}
            {sortBy === "plannedExpense - total" && (
                <span>
                {sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                ) : (
                    <ArrowDownwardIcon />
                )}
                </span>
            )}
            </StyledTableCell>
        </TableRow>
        </TableHead>

        <TableBody style={{ overflowY: "auto" }}>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              backgroundColor: "#f2f2f2",
              fontWeight: "bold",
            }}
          >
            <TableCell component="th" scope="row">
              Totals
            </TableCell>
            <TableCell align="right">£{data.planned_budget}</TableCell>
            <TableCell align="right">£{data.total_expense}</TableCell>
            <TableCell
              align="right"
              className={
                data.planned_budget - data.total_expense < 0
                  ? "negative-value"
                  : data.planned_budget - data.total_expense > 0
                  ? "positive-value"
                  : ""
              }
            >
              £{(data.planned_budget - data.total_expense).toFixed(2)}
            </TableCell>
          </TableRow>
          {sortedRows.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow style={{cursor:'pointer'}} onClick={() => handleRowClick(index)} 
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <IconButton
                    aria-label="expand"
                    size="small"
                  >
                    <ExpandMoreIcon
                      className={
                        expandedRow === index ? "expanded" : "collapsed"
                      }
                    />
                  </IconButton>
                  {row.name}
                </TableCell>
                <TableCell align="right">£{row.plannedExpense}</TableCell>
                <TableCell align="right">£{row.total.toFixed(2)}</TableCell>
                <TableCell
                  align="right"
                  className={
                    row.plannedExpense - row.total < 0
                      ? "negative-value"
                      : row.plannedExpense - row.total > 0
                      ? "positive-value"
                      : ""
                  }
                >
                  £{(row.plannedExpense - row.total).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} style={{ padding: "0px" }}>
                  <Collapse
                    in={expandedRow === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Tag</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.expenses.map((expense, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell onClick={() => setTagData(expense.tag)}>
                              <Chip style={{cursor:'pointer'}} label={expense.tag.name}  color="primary" />
                                      
                                </TableCell>
                              <TableCell align="right">
                                £{expense.amount}
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
