import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';  // Modal component
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';

import ExpenseTable from '../../components/Expense/ExpenseTable';

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), 
  marginBottom: '5px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

function AdminPage() {
  const [file, setFile] = useState(null);  
  const [uploading, setUploading] = useState(false); 
  const [uploadMessage, setUploadMessage] = useState('');  
  const [tagsNotFound, setTagsNotFound] = useState([]);  
  const [tags, setTags] = useState([]);  
  const [expensesToUpdate, setExpensesToUpdate] = useState([]);
  
  // State for modal
  const [openModal, setOpenModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // Category selection for the new tag
  const [categories, setCategories] = useState([]); // List of categories
  
  const [tagDescription, setTagDescription] = useState(null); // Keep track of the current description being processed

  useEffect(() => {
    // Fetch all existing tags and categories from the backend
    const fetchData = async () => {
      try {
        const [tagsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/tags/'),
          axios.get('http://127.0.0.1:8000/api/categories/') // Fetch categories
        ]);
        // console.log('data',tagsResponse.data, categoriesResponse.data )

        const uniqueTags = tagsResponse.data.filter(
            (tag, index, self) => index === self.findIndex((t) => t.name === tag.name)
        );
        setTags(uniqueTags); 
          
        setCategories(categoriesResponse.data); // Store categories in state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  
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
      const response = await axios.post('http://127.0.0.1:8000/api/expense/check-tags/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 206) { 
        setUploadMessage('Some tags were not found.');
        setTagsNotFound(response.data.descriptions);  

        setExpensesToUpdate(response.data.expenses);
      } else if (response.status === 200) { 
        setUploadMessage('No tags missing. Expenses processed successfully!');
        setTagsNotFound([]); 
        setExpensesToUpdate([]);
      }
    } catch (error) {
      setUploadMessage('File upload failed. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); 
    }
  };

  // Handle tag creation
  const handleCreateTag = async () => {
    if (!newTagName || !selectedCategory) {
      alert('Please enter a tag name and select a category.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/tags/create/', { 
        name: newTagName, 
        category: selectedCategory.id 
      });
      const newTag = response.data;
      console.log('tag created', response.data)
      console.log('modal closed');
      setTags([...tags, newTag]); 
      setOpenModal(false); // Close modal after creating tag
      console.log('proceed to update tag');
      // Proceed to update the tag on the specific description
      handleTagSelection(tagDescription, newTag);
      
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  // Handle tag selection
  const handleTagSelection = async (description, selectedTag) => {
    console.log('handleTagSelection', 'before try catch');
    try {
      const expenseToUpdate = expensesToUpdate.find(expense => expense.description === description);
      if (expenseToUpdate) {
        
            console.log('handleTagSelection', description, selectedTag, expensesToUpdate);
        // setTagsNotFound(tagsNotFound.filter(tagDesc => tagDesc !== description)); // Remove item from the missing tags list
      }
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  // Handle submit of corrected expenses
  const handleSubmitExpenses = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/expense/create/', { expenses: expensesToUpdate });
      if (response.status === 201) {
        setUploadMessage('Expenses created successfully!');
        setTagsNotFound([]);
        setExpensesToUpdate([]);
      }
    } catch (error) {
      console.error('Error submitting expenses:', error);
    }
  };

  return (
    <Box sx={{ padding: 1 }} height={100}>
      <Grid container spacing={1}>
        <Grid xs={4}>
          <DemoPaper>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </DemoPaper>

          <DemoPaper>
            <h3>Tags Not Found</h3>
            {tagsNotFound.length > 0 ? (
              tagsNotFound.map((description, index) => (
                <div key={index }>
                  <p>{description}</p>
                  <Autocomplete
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    key={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Select or Create Tag" />}
                    onChange={(event, value) => {
                        if (typeof value === 'string') {
                        setTagDescription(description);
                        setOpenModal(true);
                        } else if (value) {
                        handleTagSelection(description, value);
                        }
                    }}
                    freeSolo
                    />
                </div>
              ))
            ) : (
              <p>No tags missing.</p>
            )}
            {tagsNotFound.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitExpenses}
              >
                Submit Corrected Expenses
              </Button>
            )}
          </DemoPaper>
        </Grid>
        <Grid xs={8}>
         <ExpenseTable /> 
        </Grid>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Create a New Tag</DialogTitle>
        <DialogContent>
          <TextField 
            label="Tag Name" 
            fullWidth 
            value={newTagName} 
            onChange={(e) => setNewTagName(e.target.value)} 
            margin="dense"
          />
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Select Category" />}
            onChange={(event, value) => setSelectedCategory(value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleCreateTag} color="primary">Create Tag</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPage;
