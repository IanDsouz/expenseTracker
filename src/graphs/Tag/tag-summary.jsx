import React from "react";
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
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import useFetchWithToken from "../../firebase/useFetchWithToken";

const TagSummaryModal = ({ open, onClose, tag, selectedYear, selectedMonth }) => {
  const formatDate = (date) => dayjs(date).format("MMMM DD");

  const url = `http://127.0.0.1:8000/api/tags/expenses_by_tag?tag_id=${tag?.id}&year=${selectedYear}&month=${selectedMonth}`;
  const { data, loading, error } = useFetchWithToken(url);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Tag Summary - {tag?.name || "No Tag Selected"}
      </DialogTitle>

      <DialogContent dividers>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">Error loading data.</Typography>}
        {!data && !loading && <Typography>Select a tag to view summary.</Typography>}
        
        {data && (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="tag summary table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                  <TableCell>Total</TableCell>
                  <TableCell>£{data.total_monthly_amount}</TableCell>
                  <TableCell>£{data.total_yearly_amount} in {selectedYear}</TableCell>
                </TableRow>

                {data.expenses.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>£{row.amount}</TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagSummaryModal;
