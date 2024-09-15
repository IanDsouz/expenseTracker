import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Icon } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const SavingAreaCard = ({ savingArea }) => {
  return (
    <ListItem>
      <ListItemAvatar>
      <Avatar>
      <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={savingArea.name}
        secondary={
          <>
            <Typography component="span" variant="body2" color="textSecondary">
              Target Amount: ${savingArea.target_amount}
            </Typography>
            <Typography component="span" variant="body2" color="textSecondary">
              Priority: {savingArea.priority}
            </Typography>
            <Typography component="span" variant="body2" color="textSecondary">
              Notes: {savingArea.notes || 'No notes available'}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};

export default SavingAreaCard;
