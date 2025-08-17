import React, { useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useAuth } from '../../AuthContext';
import useFetchWithToken from '../../firebase/useFetchWithToken';

const ExpenseTable = () => {
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    tag: '',
    category: '',
    payment_method: 'Card',
    account: '1',
    user: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: tags } = useFetchWithToken('http://127.0.0.1:8000/api/tags/');
  const { data: categories } = useFetchWithToken('http://127.0.0.1:8000/api/categories/');
  const {
    data: expensesData,
    loading: isLoading,
    error,
    refetch: fetchExpenses,
  } = useFetchWithToken('http://127.0.0.1:8000/api/expenses?page=1&page_size=10000&sort_field=date&sort_order=desc');

  // We'll use direct fetch calls for create/update operations

  const [data, setData] = useState([]);

  useEffect(() => {
    if (expensesData) {
      const mappedData = expensesData.data.map((item) => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        date: item.date,
        tag: item.tag,
        category: item.category,
        payment_method: item.payment_method,
        account: item.account?.id || '1',
      }));
      setData(mappedData);
    }
  }, [expensesData]);

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
      setFormData({
        description: '',
        amount: '',
        date: '',
        tag: '',
        category: '',
        payment_method: 'Card',
        account: '1',
        user: 1,
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
      // Ensure user field is always set (hardcoded to 1 for now)
      const dataToSave = {
        ...formData,
        user: 1
      };

      if (isEdit) {
        // Update existing expense
        const token = await user.getIdToken();
        const updateResponse = await fetch(`http://127.0.0.1:8000/api/expenses/${formData.id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.detail || 'Failed to update expense');
        }

        setSuccessMessage('Expense updated successfully!');
      } else {
        // Create new expense
        const token = await user.getIdToken();
        const createResponse = await fetch('http://127.0.0.1:8000/api/expenses/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.detail || 'Failed to create expense');
        }

        setSuccessMessage('Expense added successfully!');
      }

      await fetchExpenses();
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Error saving data. Please try again!');
    }
  };

  const handleDelete = async (ids) => {
    if (!window.confirm('Are you sure you want to delete?')) return;

    try {
      const token = await user.getIdToken();
      await Promise.all(
        ids.map(async (id) => {
          await fetch(`http://127.0.0.1:8000/api/expenses/${id}/delete/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        })
      );
      await fetchExpenses();
      alert('Selected expenses deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to delete.');
    }
  };

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
      Cell: ({ row }) => row.original.account || 'N/A',
    },
  ];

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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Description" 
            fullWidth 
            variant="outlined" 
            name="description" 
            value={formData.description} 
            onChange={handleFormChange}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
                     <Autocomplete
             options={tags || []}
             getOptionLabel={(option) => option.name}
             value={tags?.find(tag => tag.id === formData.tag) || null}
             onChange={(event, newValue) => {
               setFormData((prev) => ({ ...prev, tag: newValue?.id || '' }));
             }}
             renderInput={(params) => <TextField {...params} margin="dense" label="Tag" />}
             sx={{ mb: 2 }}
             filterOptions={(options, { inputValue }) => {
               return options.filter(option =>
                 option.name.toLowerCase().includes(inputValue.toLowerCase())
               );
             }}
             loading={!tags}
           />
           <Autocomplete
             options={categories || []}
             getOptionLabel={(option) => option.name}
             value={categories?.find(category => category.id === formData.category) || null}
             onChange={(event, newValue) => {
               setFormData((prev) => ({ ...prev, category: newValue?.id || '' }));
             }}
             renderInput={(params) => <TextField {...params} margin="dense" label="Category" />}
             sx={{ mb: 2 }}
             filterOptions={(options, { inputValue }) => {
               return options.filter(option =>
                 option.name.toLowerCase().includes(inputValue.toLowerCase())
               );
             }}
             loading={!categories}
           />
                      <TextField 
              margin="dense" 
              label="Payment Method" 
              fullWidth 
              variant="outlined" 
              name="payment_method" 
              value={formData.payment_method} 
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField 
              margin="dense" 
              label="Account" 
              fullWidth 
              variant="outlined" 
              name="account" 
              value={formData.account} 
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
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
