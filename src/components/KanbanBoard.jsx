import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddColumnDialog from './AddColumnDialog';
import AddCardDialog from './AddCardDialog';

export default function KanbanBoard() {
  // State: columns array
  const [columns, setColumns] = useState([]);
  // Dialog states
  const [colDialogOpen, setColDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  // For editing
  const [editColTitle, setEditColTitle] = useState('');
  const [editCardData, setEditCardData] = useState(null);

  // Drag & Drop handler
  const onDragEnd = (res) => {
    const { source, destination, draggableId } = res;
    if (!destination) return;
    // Same column
    if (source.droppableId === destination.droppableId) {
      const col = columns.find((c) => c.id === source.droppableId);
      const newCards = Array.from(col.cards);
      const [moved] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, moved);
      setColumns(columns.map((c) =>
        c.id === col.id ? { ...c, cards: newCards } : c
      ));
    } else {
      // Move across columns
      const sourceCol = columns.find((c) => c.id === source.droppableId);
      const destCol   = columns.find((c) => c.id === destination.droppableId);
      const sourceCards = Array.from(sourceCol.cards);
      const destCards   = Array.from(destCol.cards);
      const [moved] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, moved);
      setColumns(columns.map((c) => {
        if (c.id === sourceCol.id) return { ...c, cards: sourceCards };
        if (c.id === destCol.id)   return { ...c, cards: destCards };
        return c;
      }));
    }
  };

  // Column handlers
  const handleAddColumn = (title) => {
    const id = Date.now().toString();
    setColumns([...columns, { id, title, cards: [] }]);
  };

  // Card handlers
  const handleAddCard = (card) => {
    setColumns(columns.map((col) =>
      col.id === currentColumn
        ? { ...col, cards: [...col.cards, card] }
        : col
    ));
  };

  return (
    <Box sx={{ p: 2, display: 'flex', overflowX: 'auto', height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: 300,
                  minWidth: 300,
                  mr: 2,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'grey.100',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{col.title}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setCurrentColumn(col.id);
                      setEditCardData(null);
                      setCardDialogOpen(true);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
                  {col.cards.map((card, idx) => (
                    <Draggable
                      draggableId={card.id}
                      index={idx}
                      key={card.id}
                    >
                      {(prov) => (
                        <Paper
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          sx={{ p: 1, mb: 1, cursor: 'grab' }}
                        >
                          <Typography variant="subtitle1">
                            {card.title}
                          </Typography>
                          <Typography variant="body2">
                            {card.description}
                          </Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              </Paper>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {/* Add Column Button */}
      <Box sx={{ minWidth: 300 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditColTitle('');
            setColDialogOpen(true);
          }}
          sx={{ height: 40, mt: 1 }}
        >
          Add Column
        </Button>
      </Box>

      {/* Dialogs */}
      <AddColumnDialog
        open={colDialogOpen}
        initialTitle={editColTitle}
        onClose={() => setColDialogOpen(false)}
        onSave={handleAddColumn}
      />
      <AddCardDialog
        open={cardDialogOpen}
        initialData={editCardData}
        onClose={() => setCardDialogOpen(false)}
        onSave={handleAddCard}
      />
    </Box>
  );
}
