import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ExpenseTable from "../../components/Expense/ExpenseTable";
import useFetchWithToken from "../../firebase/useFetchWithToken";
import { useAuth } from "../../AuthContext";

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: "5px",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

function AdminPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [tagsNotFound, setTagsNotFound] = useState([]);
  const [tags, setTags] = useState([]);
  const [expensesToUpdate, setExpensesToUpdate] = useState([]);
  const [categories, setCategories] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tagDescription, setTagDescription] = useState(null);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category: null,
    tag: null
  });
  const [addingExpense, setAddingExpense] = useState(false);

  const { user } = useAuth();

  const urlTags = "http://127.0.0.1:8000/api/tags/"
  const { data:tagsData, loading:tagsLoading } = useFetchWithToken(urlTags);

  const urlCategory = "http://127.0.0.1:8000/api/categories/"
  const { data: categoriesData, loading: categoriesLoading } = useFetchWithToken(urlCategory);

  useEffect(() => {
    if (tagsData) {
      const uniqueTags = tagsData.filter(
        (tag, index, self) => index === self.findIndex((t) => t.name === tag.name)
      );
      setTags(uniqueTags);
    }
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [tagsData, categoriesData]);

  const fetchWithToken = async (url, method = "GET", body = null) => {
    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Fetch failed");
    }

    return response.json();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const token = await user.getIdToken();
      const response = await fetch("http://127.0.0.1:8000/api/expense/check-tags", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('res', response);

      if (response.status === 206) {
        const data = await response.json();
        setUploadMessage("Some tags were not found.");
        setTagsNotFound(data.descriptions);
        setExpensesToUpdate(data.expenses);
      } else if (response.status === 200) {
        setUploadMessage("No tags missing. Expenses processed successfully!");
        setTagsNotFound([]);
        setExpensesToUpdate([]);
      } else {
        setUploadMessage("Unexpected server response.");
      }
    } catch (error) {
      setUploadMessage("File upload failed. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName || !selectedCategory) {
      alert("Please enter a tag name and select a category.");
      return;
    }

    try {
      const newTag = await fetchWithToken(
        "http://127.0.0.1:8000/api/tags/create/",
        "POST",
        {
          name: newTagName,
          category: selectedCategory.id,
        }
      );
      setTags([...tags, newTag]);
      setOpenModal(false);
      handleTagSelection(tagDescription, newTag);
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleTagSelection = async (description, selectedTag) => {
    try {
      const expenseToUpdate = expensesToUpdate.find((expense) => expense.description === description);
      if (expenseToUpdate) {
        expenseToUpdate.tag = selectedTag.id;
        console.log("Updating expense:", description, selectedTag);
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleSubmitExpenses = async () => {
    try {
      await fetchWithToken(
        "http://127.0.0.1:8000/api/expense/create/",
        "POST",
        {
          expenses: expensesToUpdate,
        }
      );
      setUploadMessage("Expenses created successfully!");
      setTagsNotFound([]);
      setExpensesToUpdate([]);
    } catch (error) {
      console.error("Error submitting expenses:", error);
    }
  };

  // New expense form handlers
  const handleNewExpenseChange = (field, value) => {
    setNewExpense(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category || !newExpense.tag) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setAddingExpense(true);
      
      const expenseData = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date || new Date().toISOString().split('T')[0],
        category: newExpense.category.id,
        tag: newExpense.tag.id
      };

      await fetchWithToken(
        "http://127.0.0.1:8000/api/expense/create/",
        "POST",
        {
          expenses: [expenseData],
        }
      );

      // Reset form
      setNewExpense({
        description: "",
        amount: "",
        date: "",
        category: null,
        tag: null
      });

      alert("Expense added successfully!");
      
      // Refresh the expense table
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setAddingExpense(false);
    }
  };

  return (
    <Box sx={{ padding: 2, height: "100vh" }}>
      <Grid container spacing={2}>
        {/* Expense Table Section (Wider) */}
        <Grid item xs={8}>
          <DemoPaper sx={{ height: "100%" }}>
            <ExpenseTable />
          </DemoPaper>
        </Grid>

        {/* Right Side Panel */}
        <Grid item xs={4}>
          {/* Add New Expense Section */}
          <DemoPaper>
            <Typography variant="h6" gutterBottom>
              ➕ Add New Expense
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              label="Description"
              fullWidth
              value={newExpense.description}
              onChange={(e) => handleNewExpenseChange('description', e.target.value)}
              margin="dense"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Amount"
              fullWidth
              type="number"
              value={newExpense.amount}
              onChange={(e) => handleNewExpenseChange('amount', e.target.value)}
              margin="dense"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Date"
              fullWidth
              type="date"
              value={newExpense.date}
              onChange={(e) => handleNewExpenseChange('date', e.target.value)}
              margin="dense"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Category" />}
              value={newExpense.category}
              onChange={(event, value) => handleNewExpenseChange('category', value)}
              fullWidth
              sx={{ mb: 2 }}
              loading={categoriesLoading}
              filterOptions={(options, { inputValue }) => {
                return options.filter(option =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
            />
            
            <Autocomplete
              options={tags}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Tag" />}
              value={newExpense.tag}
              onChange={(event, value) => handleNewExpenseChange('tag', value)}
              fullWidth
              sx={{ mb: 2 }}
              loading={tagsLoading}
              filterOptions={(options, { inputValue }) => {
                return options.filter(option =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddExpense}
              disabled={addingExpense}
              fullWidth
            >
              {addingExpense ? <CircularProgress size={24} /> : "Add Expense"}
            </Button>
          </DemoPaper>

          {/* Bulk Upload Section */}
          <DemoPaper>
            <Typography variant="h6" gutterBottom>
              📁 Bulk Upload
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
              fullWidth
            >
              {uploading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </DemoPaper>

          {/* Tags Not Found Section */}
          <DemoPaper>
            <Typography variant="h6" gutterBottom>
              🏷️ Tags Not Found
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {tagsNotFound.length > 0 ? (
              tagsNotFound.map((description, index) => (
                <div key={index}>
                  <p>{description}</p>
                  <Autocomplete
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Select or Create Tag" />
                    )}
                    onChange={(event, value) => {
                      if (typeof value === "string") {
                        setTagDescription(description);
                        setOpenModal(true);
                      } else if (value) {
                        handleTagSelection(description, value);
                      }
                    }}
                    freeSolo
                    filterOptions={(options, { inputValue }) => {
                      return options.filter(option =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                      );
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No tags missing.</p>
            )}
            {tagsNotFound.length > 0 && (
              <Button variant="contained" color="primary" onClick={handleSubmitExpenses}>
                Submit Corrected Expenses
              </Button>
            )}
          </DemoPaper>
        </Grid>
      </Grid>

      {/* Tag Creation Modal */}
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
            filterOptions={(options, { inputValue }) => {
              return options.filter(option =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
              );
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTag} color="primary">
            Create Tag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPage;
