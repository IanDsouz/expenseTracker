import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import dayjs from "dayjs";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), 
  marginBottom: '5px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

function AdminPage() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [file, setFile] = useState(null);  // State to store the selected file
  const [uploading, setUploading] = useState(false); // State for upload status
  const [uploadMessage, setUploadMessage] = useState(''); // State to store response message

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // Store the selected file in state
  };

  // Handle form submission to upload the file
  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/expense/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle the API response (success)
      setUploadMessage(response.data.message);  // Show success message
      console.log('Uploaded data:', response.data.data);  // Log the data for debugging

    } catch (error) {
      // Handle the API response (error)
      setUploadMessage('File upload failed. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); // End the loading state
    }
  };

  return (
    <Box sx={{ padding: 1 }} height={100}>
      <Grid container spacing={1}>
        <Grid xs={4}>
          {/* File input and upload button */}
          <DemoPaper>
            <input
              type="file"
              accept=".csv"  // Accept CSV files (adjust based on your needs)
              onChange={handleFileChange}
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}  // Disable the button during upload
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
            {/* Display response message */}
            {uploadMessage && <p>{uploadMessage}</p>}
          </DemoPaper>
          <DemoPaper>Import Expenses</DemoPaper>
        </Grid>
        <Grid xs={4}>
          <DemoPaper>My Cashflow for June</DemoPaper>
          <DemoPaper>Stored For Goals</DemoPaper>
        </Grid>
        <Grid xs={4}>
          <DemoPaper></DemoPaper>
          <DemoPaper>Invest in My Future</DemoPaper>
          <DemoPaper>Paying Off Loans</DemoPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPage;
