import { useEffect, useState } from "react";
import SplitPane from "./SplitPane3";
import {
  List, ListItem, ListItemButton, ListItemText,
  Typography, CircularProgress, Box, TextField, Button, Stack,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { MatrixEditorView } from "./MatrixEditorView";
import CrudDialogForm from "./CRUDDialogForm"; // adjust path if needed
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import MonacoViewer from './MonacoViewer';

function RightPaneRenderer({ setCurrentCell, setOpenCreateRequest, setOpenCreateResponse, handleDelete, cell, matrix }) {
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerTitle, setViewerTitle] = useState('');
  const [viewerValue, setViewerValue] = useState('');

  const openField = (title, value) => {
    setViewerTitle(title);
    setViewerValue(value ?? '');
    setOpenViewer(true);
  };

  if (!cell) return null;
      const { x, y, text, agent, timestamp } = cell;
      const id = cell.requestId ?? cell.responseId ?? '';

      return (
        <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
          <Typography variant="overline">Cell ({x}, {y})</Typography>

          <TextField
            label="ID"
            size="small"
            value={id}
            onChange={() => {}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Open ID viewer"
                    edge="end"
                    size="small"
                    onClick={() => openField('ID', id)}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label="Text"
            size="small"
            value={text ?? ''}
            onChange={() => {}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Open Text viewer"
                    edge="end"
                    size="small"
                    onClick={() => openField('Text', text)}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label="Agent"
            size="small"
            value={agent ?? ''}
            onChange={() => {}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Open Agent viewer"
                    edge="end"
                    size="small"
                    onClick={() => openField('Agent', agent)}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label="Timestamp"
            size="small"
            value={timestamp ?? ''}
            onChange={() => {}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Open Timestamp viewer"
                    edge="end"
                    size="small"
                    onClick={() => openField('Timestamp', timestamp)}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Matrix size: {matrix?.width} × {matrix?.height}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentCell(cell);
                setOpenCreateRequest(true);
              }}
            >
              Create request
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setCurrentCell(cell);
                setOpenCreateResponse(true);
              }}
            >
              Create response
            </Button>
            <Button color="error" variant="contained" onClick={() => handleDelete(cell)}>
              Delete
            </Button>
          </Stack>

          {/* Full-screen viewer dialog (read-only) */}
          <Dialog fullScreen open={openViewer} onClose={() => setOpenViewer(false)}>
            <AppBar sx={{ position: 'sticky' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setOpenViewer(false)} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  {viewerTitle} — Viewer
                </Typography>
              </Toolbar>
            </AppBar>

            <Box sx={{ height: '100vh', p: { xs: 0, sm: 2 } }}>
              <MonacoViewer value={viewerValue} />
            </Box>
          </Dialog>
        </Box>
      );
}

export default function MatrixListWithDetails({ identifier }) {
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);

  // force-refresh MatrixEditorView after creates
  const [refreshTick, setRefreshTick] = useState(0);

  // dialogs
  const [openCreateRequest, setOpenCreateRequest] = useState(false);
  const [openCreateResponse, setOpenCreateResponse] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api-digitalsymphony.ngrok.pizza/api/${identifier}`)
      .then((res) => setMatrices(res.data))
      .finally(() => setLoading(false));
  }, [identifier]);

  // ---- fields for dialogs ----
  const requestFields = [
    // { name: "id", label: "ID", editable: false } // omitted for create
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
    {
      tablePath: "destination.name",
      formPath: "destination",
      name: "destination",
      label: "Destination",
      type: "entity",
      url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
      valueKey: "id",
      labelKey: "name",
    },
  ];

  const responseFields = [
    // { name: "id", label: "ID", editable: false } // omitted for create
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
  ];

  // ---- save handlers ----
  const handleCreateRequest = async (vals) => {
    let payload = {
      text: vals.text ?? null,
      timestamp: vals.timestamp,
      destination: vals.destination
    };

    if(currentCell.requestId) {
      let req = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/requests/${currentCell.requestId}`);
      payload.source = req.data.destination
      payload.interaction = {
        id: currentItem.id
      }
    } else if(currentCell.responseId) {
      let res = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/responses/${currentCell.responseId}`);
      payload.interaction = {
        id: res.data.request.interaction_id
      }
      payload.source = {
        id: res.data.request.source_id,
        uuid: "Dummy UUID"
      }
    }
    
    
    console.log(payload)
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/requests`, payload);
    setOpenCreateRequest(false);
    setRefreshTick((t) => t + 1);
  };

  const handleCreateResponse = async (vals) => {
    const payload = {
      text: vals.text ?? null,
      timestamp: vals.timestamp,
    };
    if(currentCell.requestId) {
      payload.request = {
        id: currentCell.requestId
      }
    } else if(currentCell.responseId) {
      let res = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/responses/${currentCell.responseId}`);
      let requestId = res.data.request.id
      let previousRequestResponse = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/requests/${requestId}/previous`)
      payload.request = {
        id: previousRequestResponse.data.id
      }
    }
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/responses`, payload);
    setOpenCreateResponse(false);
    setRefreshTick((t) => t + 1);
  };

  const handleDelete = async (vals) => {
    if(vals.requestId) {
      await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/requests/${vals.requestId}`);
    } else if(vals.responseId) {
      await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/responses/${vals.responseId}`);
    }
    setRefreshTick((t) => t + 1);
  };

  return (
    <>
      <SplitPane
        initialSplit={0.2}
        left={
          <Box sx={{ height: "100%", overflow: "auto" }}>
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
              Matrices
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <List dense>
                {matrices.map((matrix) => (
                  <ListItem
                    key={matrix.id}
                    disablePadding
                    selected={currentItem?.id === matrix.id}
                  >
                    <ListItemButton onClick={() => setCurrentItem(matrix)}>
                      <ListItemText
                        primary={matrix.name}
                        secondary={`ID: ${matrix.id}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        }
        right={
          currentItem ? (
            <MatrixEditorView
              key={`${currentItem.id}-${refreshTick}`}
              identifier={identifier}
              matrixId={currentItem.id}
              renderRightPane={({ cell, matrix /*, closePane, updateCell, deleteCell */ }) => {
                return <RightPaneRenderer 
                setOpenCreateRequest={setOpenCreateRequest} 
                setOpenCreateResponse={setOpenCreateResponse} 
                setCurrentCell={setCurrentCell} 
                handleDelete={handleDelete} 
                cell={cell} 
                matrix={matrix}
                ></RightPaneRenderer>
              }}
            />
          ) : (
            <Box sx={{ p: 4, color: "text.secondary" }}>
              <Typography>Select a matrix to edit.</Typography>
            </Box>
          )
        }
      />

      {/* ---- Create Request Dialog ---- */}
      <CrudDialogForm
        open={openCreateRequest}
        mode="create"
        initialValues={{}}
        fields={requestFields}
        onSave={handleCreateRequest}
        onClose={() => setOpenCreateRequest(false)}
        titleCreate="Create Request"
      />

      {/* ---- Create Response Dialog ---- */}
      <CrudDialogForm
        open={openCreateResponse}
        mode="create"
        initialValues={{}}
        fields={responseFields}
        onSave={handleCreateResponse}
        onClose={() => setOpenCreateResponse(false)}
        titleCreate="Create Response"
      />
    </>
  );
}
