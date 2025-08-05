import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import CalendarEventDialog from './CalendarEventDialog';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: '#ced7e0',
  borderRadius: '4px',
  padding: theme.spacing(2),
  ...theme.applyStyles('dark', {
    borderColor: '#444d58',
  }),
}));

export default function FullHeightCalendarTasksList({ itemID, width, onItemClick }) {
const [items, setItems] = useState([])
const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
    const fetchItems = async () => {
        const res = await fetch(`https://api-digitalsymphony.ngrok.pizza/items/${itemID}/calendar-tasks`);
        const data = await res.json();
        setItems(data)
    }

    const deleteItem = async (id) => {
      await fetch(`https://api-digitalsymphony.ngrok.pizza/calendar-tasks/${id}`, { method: 'DELETE' });
      await fetchItems();
    }

    const updateEvent = async (id, updates) => {
      await fetch(`https://api-digitalsymphony.ngrok.pizza/calendar-tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
      });
      await fetchItems()
    }

    const handleSaveEvent = (event) => {
    if (event.id) {
      updateEvent(event.id, event);
    }
  };

  const openEditDialog = (item) => {
    setEditData(item);
    setEditOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    deleteItem(id)
    setEditOpen(false);
    setEditData(null);
  };

  useEffect(() => {
    fetchItems();
  }, [itemID, width, onItemClick]);

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
                    button
                    onClick={() => handleItemClick(item)}
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
                  >
                    <ListItemText primary={item.title} />
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
      </Grid>
      <CalendarEventDialog
              open={editOpen}
              initialData={editData}
              onClose={() => setEditOpen(false)}
              onSave={handleSaveEvent}
              onDelete={handleDeleteEvent}
              timeZone={editData?.timeZone}
            />
    </Box>
  );
}
