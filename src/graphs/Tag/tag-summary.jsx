import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";

const TagSummary = ({tag, selectedYear, selectedMonth }) => {

  const [data, setData] = useState(null);

  const formatDate = (date) => {
    // Assuming `date` is a string in a format that dayjs can parse
    const formattedDate = dayjs(date).format("MMMM DD"); // Format the date as 'Month Day'
    return formattedDate;
  };

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/expenses_by_tag?tag_id=${tag?.id}&year=${selectedYear}&month=${selectedMonth}`
      )
      .then((response) => {
        console.log('res tag', response);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedYear, selectedMonth, tag]);


  let sortedRows = [];

  if (!data) {
    return <div>Select Tag...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
            <TableCell >
            Category
            </TableCell>
            <TableCell >
            Amount
            </TableCell>

            <TableCell >
            Date
            </TableCell>
        
        </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              backgroundColor: "#f2f2f2",
              fontWeight: "bold",
            }}
          >
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell >£{data.total_monthly_amount} </TableCell>
            <TableCell >£{data.total_yearly_amount} in {selectedYear} </TableCell>
          </TableRow>
          {data.expenses.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
            
                  {row.description}
                </TableCell>
                <TableCell >£{row.amount}</TableCell>
                <TableCell >{formatDate(row.date)}</TableCell>
              </TableRow>
              <TableRow>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TagSummary;
