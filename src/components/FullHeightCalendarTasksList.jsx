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
  
    const fetchItems = async () => {
        const res = await fetch(`http://localhost:3000/items/${itemID}/calendar-tasks`);
        const data = await res.json();
        setItems(data)
    }

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
    </Box>
  );
}
