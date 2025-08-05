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
import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionList from './TransactionList';
import SplitPane from './SplitPane3';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: '#ced7e0',
  borderRadius: '4px',
  padding: theme.spacing(2),
  ...theme.applyStyles('dark', {
    borderColor: '#444d58',
  }),
}));

function FullHeightTransactionLists({ width, onItemClick, onRefresh }) {
let [items, setItems] = useState([])

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [editingId, setEditingId] = useState(null);

  function reloadData() {
axios.get(`https://api-digitalsymphony.ngrok.pizza/transaction-lists`).then((res) => {
        setItems(res.data)
    })
  }

  useEffect(() => {
    reloadData()

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

//   const handleSave = () => {
//     if (editMode) {
//       updateItem(editingId, currentText);
//     } else {
//       addItem(currentText);
//     }
//     setDialogOpen(false);
//     setCurrentText('');
//   };

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
                    key={item}
                    // secondaryAction={
                    //   <>
                    //     <IconButton onClick={() => openEditDialog(item)}>
                    //       <EditIcon />
                    //     </IconButton>
                    //     <IconButton onClick={() => deleteItem(item.id)}>
                    //       <DeleteIcon />
                    //     </IconButton>
                    //   </>
                    // }
                    button
                    onClick={() => handleItemClick(item)}
                  >
                    <ListItemText primary={item} />
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
          <Button variant="contained" onClick={() => reloadData()}>
            Refresh
          </Button>
        </Grid>
      </Grid>

      {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
      </Dialog> */}
    </Box>
  );
}

export default function TransactionListWithData() {

    let [category, setCategory] = useState(null)
    let [transactions, setTransactions] = useState([])

    function reloadData() {
        axios.get(`https://api-digitalsymphony.ngrok.pizza/transaction-lists/${category}/transactions`).then(res => {
            setTransactions(res.data)
        })
    }

    useEffect(() => {
        reloadData()
    }, [category])

    return <SplitPane initialSplit={0.2} 
    left={<FullHeightTransactionLists onItemClick={(item) => {
        setCategory(item)
    }}></FullHeightTransactionLists>} 
      right={<TransactionList transactions={transactions} onRefresh={reloadData}></TransactionList>}></SplitPane>
}