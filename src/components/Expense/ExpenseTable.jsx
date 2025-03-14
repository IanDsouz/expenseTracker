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

  // State for dropdowns
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/expenses', {
        params: { page: 1, page_size: 10000, sort_field: 'date', sort_order: 'desc' },
      });
      // setData(response.data.data);
      const fetchedData = response.data.data.map(item => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        date: item.date,
        tag: item.tag,
        category: item.category,
        payment_method: item.payment_method,
        account: item.account?.id || 1,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    {
      accessorKey: 'account',
      header: 'Account',
      Cell: ({ row }) => row.original.account || 'N/A',  // Display account ID or 'N/A'
    },
  ];


  const handleOpenDialog = (row) => {
    if (row) {
      setFormData({
        id: row.original.id,
        description: row.original.description,
        amount: row.original.amount,
        date: row.original.date,
        tag: row.original.tag?.id || '',  // Ensure tag ID is selected
        category: row.original.category?.id || '',  // Ensure category ID is selected
        payment_method: row.original.payment_method,
        account: row.original.account,
        user:1
      });
      setIsEdit(true);
    } else {
      setFormData({
        description: '',
        amount: '',
        date: '',
        tag: '',
        category: '',
        payment_method: 'Card',
        account: '1',
      });
      setIsEdit(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/api/expenses/${formData.id}/update/`, formData);
        setSuccessMessage('Expense updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/expenses/create/', formData);
        setSuccessMessage('Expense added successfully!');
      }
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      setErrorMessage('Error saving data. Please try again!');
    }
  };

  const handleDelete = async (ids) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try {
      await Promise.all(ids.map((id) => axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/delete/`)));
      setData((prev) => prev.filter((item) => !ids.includes(item.id)));
      alert('Selected expenses deleted successfully!');
    } catch (error) {
      alert('Failed to delete.');
    }
  };

  const renderRowActions = ({ row }) => (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <Button size="small" onClick={() => handleOpenDialog(row)}>Edit</Button>
      <Button size="small" color="secondary" onClick={() => handleDelete([row.original.id])}>Delete</Button>
    </Box>
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
    initialState: { pagination: { pageIndex: 0, pageSize: 50 }, showGlobalFilter: true },
    defaultColumn: { minSize: 50, maxSize: 100 },
    muiTableProps: { sx: { '& td, & th': { padding: '4px', fontSize: '12px' } } },
  });

  return (
    <Box>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Box>
          <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => handleOpenDialog(null)}>
            Add New Expense
          </Button>
          <MaterialReactTable table={table} />
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Description" fullWidth variant="outlined" name="description" value={formData.description} onChange={handleFormChange} />
          <TextField margin="dense" label="Amount" type="number" fullWidth variant="outlined" name="amount" value={formData.amount} onChange={handleFormChange} />
          <TextField margin="dense" label="Date" type="date" fullWidth variant="outlined" name="date" value={formData.date} onChange={handleFormChange} />
          <Select fullWidth margin="dense" name="tag" value={formData.tag} onChange={handleFormChange}>
            {tags.map((tag) => (<MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>))}
          </Select>
          <Select fullWidth margin="dense" name="category" value={formData.category} onChange={handleFormChange}>
            {categories.map((category) => (<MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>))}
          </Select>
          <TextField margin="dense" label="Payment Method" fullWidth variant="outlined" name="payment_method" value={formData.payment_method} onChange={handleFormChange} />
          <TextField margin="dense" label="Account" fullWidth variant="outlined" name="account" value={formData.account} onChange={handleFormChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpenseTable;
