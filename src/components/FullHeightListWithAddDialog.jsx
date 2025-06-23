import * as React from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createItemStore } from '../stores/item.api';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: '#ced7e0',
  borderRadius: '4px',
  padding: theme.spacing(2),
  ...theme.applyStyles('dark', {
    borderColor: '#444d58',
  }),
}));

export default function FullHeightListWithAddDialog({ listKey, width, onItemClick }) {
const useStore = React.useMemo(() => createItemStore(listKey), [listKey]);
  const {
    items,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  } = useStore();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [currentText, setCurrentText] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);

  React.useEffect(() => {
    fetchItems();
  }, []);

  const openAddDialog = () => {
    setEditMode(false);
    setCurrentText('');
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditMode(true);
    setEditingId(item.id);
    setCurrentText(item.name);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editMode) {
      updateItem(editingId, currentText);
    } else {
      addItem(currentText);
    }
    setDialogOpen(false);
    setCurrentText('');
  };

  const handleItemClick = (item) => {
    onItemClick?.(item)
  };

  return (
    <Box sx={{ height: '100%', width: width ?? '100%', p: 2 }}>
      <Grid container direction="column" spacing={2} sx={{ height: '100%' }}>
        <Grid size="auto">
          <Typography variant="h6">My Items</Typography>
        </Grid>

        <Grid grow sx={{ overflow: 'auto' }}>
          <Item>
            <List>
              {items.length > 0 ? (
                items.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <>
                        <IconButton onClick={() => openEditDialog(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                    button
                    onClick={() => handleItemClick(item)}
                  >
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No items yet
                </Typography>
              )}
            </List>
          </Item>
        </Grid>

        <Grid size="auto">
          <Button variant="contained" onClick={openAddDialog}>
            Add Item
          </Button>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Item Text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
