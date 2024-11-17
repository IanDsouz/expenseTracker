import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

const ExpenseTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    tag: '',
    category: '',
    payment_method: '',
    account: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // State to hold related data for dropdowns
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch all related data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tagsRes, categoriesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/tags/'),
          axios.get('http://127.0.0.1:8000/api/categories/'),
        ]);

        setTags(tagsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    };

    fetchAllData();
  }, []);

  // Fetch expense data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/expenses', {
          params: {
            page: 1,
            page_size: 10000,
            sort_field: 'date',
            sort_order: 'desc',
          },
        });
        const fetchedData = response.data.data.map(item => ({
          id: item.id,
          description: item.description,
          amount: item.amount,
          date: item.date,
          tag: item.tag,
          category: item.category,
          payment_method: item.payment_method,
          account: 1,
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'date', header: 'Date' },
    {
      accessorKey: 'tag',
      header: 'Tag',
      Cell: ({ row }) => row.original.tag?.name || '', 
    },
    {
      accessorKey: 'category',
      header: 'Category',
      Cell: ({ row }) => row.original.category?.name || '', 
    },
    { accessorKey: 'payment_method', header: 'Payment Method' },
    { accessorKey: 'account', header: 'Account' }
  ];
  

  // Handle dialog open (for adding/editing data)
  const handleOpenDialog = (row) => {
    if (row) {
      setFormData({
        id: row.original.id, 
        description: row.original.description,
        amount: row.original.amount,
        date: row.original.date,
        tag: row.original.tag?.id || '',  
        category: row.original.category?.id || '', 
        payment_method: row.original.payment_method,
        account: row.original.account,
        user: 1,
      });
      setIsEdit(true);
    } else {
      setFormData({ description: '', amount: '', date: '', tag: '', category: '', payment_method: 'Card', account: '1' });
      setIsEdit(false);
    }
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save data (add or edit)
  const handleSave = async () => {
    try {
      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/api/expenses/${formData.id}/update/`, formData);
        await fetchData(); 
        setSuccessMessage('Expense updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/expenses/create/', formData);
        await fetchData(); 
        setSuccessMessage('Expense added successfully!');
      }
      setOpenDialog(false);
    } catch (error) {
      setErrorMessage('Error saving data. Please try again!');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/expenses', {
        params: {
          page: 1,
          page_size: 10000,
          sort_field: 'date',
          sort_order: 'desc',
        },
      });
      const fetchedData = response.data.data.map(item => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        date: item.date,
        tag: item.tag,
        category: item.category,
        payment_method: item.payment_method,
        account: 1,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle row delete
  const handleDelete = async (idsToDelete) => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected expenses?');
    if (!confirmDelete) return;

    try {
      const deletePromises = idsToDelete.map(id =>
        axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/delete/`)
      );
      await Promise.all(deletePromises);
      setData(prevData => prevData.filter(item => !idsToDelete.includes(item.id)));
      alert("Selected expenses deleted successfully!");
    } catch (error) {
      console.error("Error deleting expenses:", error);
      alert("Failed to delete the selected expenses.");
    }
  };

  // Row actions (Edit and Delete)
  const renderRowActions = ({ row }) => (
    <div>
      <Button onClick={() => handleOpenDialog(row)}>Edit</Button>
      <Button color="secondary" onClick={() => handleDelete([row.original.id])}>Delete</Button>
    </div>
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    enableSorting: true,
    enableRowSelection: true,
    renderRowActions,
    enableRowActions: true,
    enableGlobalFilter: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
      showGlobalFilter: true,
    },
    defaultColumn : {
      minWidth: 50, 
      maxWidth: 100,
    }

  });


  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Box>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
            Add New Expense
          </Button>

          <MaterialReactTable table={table}   muiTableBodyCellProps={{
    sx: {
      padding: '4px',
    },
  }}
  muiTableHeadCellProps={{
    sx: {
      padding: '4px',
    },
  }} />
        </Box>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            name="amount"
            value={formData.amount}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
          />
          {/* Tag Select Dropdown */}
          <Select
            fullWidth
            margin="dense"
            variant="outlined"
            name="tag"
            value={formData.tag} 
            onChange={handleFormChange}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            margin="dense"
            variant="outlined"
            name="category"
            value={formData.category} 
            onChange={handleFormChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>

          <TextField
            margin="dense"
            label="Payment Method"
            type="text"
            fullWidth
            variant="outlined"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Account"
            type="text"
            fullWidth
            variant="outlined"
            name="account"
            value={formData.account}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {successMessage && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
          <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
        </Snackbar>
      )}

      {errorMessage && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default ExpenseTable;
