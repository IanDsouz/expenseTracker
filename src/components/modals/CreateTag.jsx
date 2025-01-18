import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Autocomplete } from '@mui/material';
// Import other necessary MUI components
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function CreateTagModal({ open, onClose, categories, onTagCreate }) {
  const [tagName, setTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubmit = async () => {
    if (tagName && selectedCategory) {
      await onTagCreate(tagName, selectedCategory);
      onClose();  // Close the modal after creation
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Create New Tag
        </Typography>
        <TextField
          fullWidth
          label="Tag Name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          margin="normal"
        />
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Category" />}
          onChange={(event, value) => setSelectedCategory(value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!tagName || !selectedCategory}
          sx={{ marginTop: 2 }}
        >
          Create Tag
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateTagModal;
