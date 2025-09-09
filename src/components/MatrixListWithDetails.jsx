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

function RightPaneRenderer({
  setCurrentCell,
  setOpenCreateRequest,
  setOpenCreatePreviousRequest, // NEW
  setOpenCreateResponse,
  handleDelete,
  cell,
  matrix
}) {
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerTitle, setViewerTitle] = useState('');
  const [viewerValue, setViewerValue] = useState('');

  const openField = (title, value) => {
    setViewerTitle(title);
    setViewerValue(value ?? '');
    setOpenViewer(true);
  };

  if (!cell) return null;
  const { x, y, text, agent, agentId, timestamp } = cell;
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
        label="AgentID"
        size="small"
        value={agentId ?? ''}
        onChange={() => {}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Open Agent ID viewer"
                edge="end"
                size="small"
                onClick={() => openField('Agent ID', agentId)}
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

      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentCell(cell);
            setOpenCreateRequest(true);
          }}
        >
          Create request
        </Button>
        {cell.requestId ? <Button
          variant="outlined"
          onClick={() => {
            console.log(cell)
            setCurrentCell(cell);
            setOpenCreatePreviousRequest(true);
          }}
        >
          Create Previous Request
        </Button> : null}
        

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

export default function MatrixListWithDetails({ identifier, matrixId }) {
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);

  // force-refresh MatrixEditorView after creates
  const [refreshTick, setRefreshTick] = useState(0);

  // dialogs
  const [openCreateRequest, setOpenCreateRequest] = useState(false);
  const [openCreatePreviousRequest, setOpenCreatePreviousRequest] = useState(false); // NEW
  const [openCreateResponse, setOpenCreateResponse] = useState(false);

  const singleMode = !!matrixId;

  // If matrixId is provided, immediately select it and skip list fetch.
  useEffect(() => {
    if (singleMode) {
      setCurrentItemId(matrixId);
      setLoading(false);
    }
  }, [singleMode, matrixId]);

  // Fetch matrices only when not in single mode (to power the left list).
  useEffect(() => {
    if (singleMode) return;
    setLoading(true);
    axios
      .get(`https://api-digitalsymphony.ngrok.pizza/api/${identifier}`)
      .then((res) => setMatrices(res.data))
      .finally(() => setLoading(false));
  }, [identifier, singleMode]);

  // ---- fields for dialogs ----
  const requestFields = [
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

  const previousRequestFields = [
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
    {
      tablePath: "source.name",
      formPath: "source",
      name: "source",
      label: "Source",
      type: "entity",
      url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
      valueKey: "id",
      labelKey: "name",
    },
  ];

  const responseFields = [
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

    if (currentCell?.requestId) {
      payload.previousRequest = { id: currentCell.requestId };
    } else if (currentCell?.responseId) {
      payload.previousResponse = { id: currentCell.responseId };
    }

    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/requests`, payload);
    setOpenCreateRequest(false);
    setRefreshTick((t) => t + 1);
  };

  // NEW: create previous request for the selected cell
  const handleCreatePreviousRequest = async (vals) => {
    const id = currentCell?.requestId ?? currentCell?.responseId; // selected cell's id
    if (!id) {
      // No ID on the selected cell; nothing to do.
      setOpenCreatePreviousRequest(false);
      return;
    }

    const payload = {
      text: vals.text ?? null,
      timestamp: vals.timestamp,
      source: vals.source
    };

    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/requests/${id}/previousRequest`, payload);
    setOpenCreatePreviousRequest(false);
    setRefreshTick((t) => t + 1);
  };

  const handleCreateResponse = async (vals) => {
    const payload = {
      text: vals.text ?? null,
      timestamp: vals.timestamp,
    };
    if (currentCell?.requestId) {
      payload.request = { id: currentCell.requestId };
    } else if (currentCell?.responseId) {
      payload.previousResponse = { id: currentCell.responseId };
    }
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/responses`, payload);
    setOpenCreateResponse(false);
    setRefreshTick((t) => t + 1);
  };

  const handleDelete = async (vals) => {
    if (vals.requestId) {
      await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/requests/${vals.requestId}`);
    } else if (vals.responseId) {
      await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/responses/${vals.responseId}`);
    }
    setRefreshTick((t) => t + 1);
  };

  const rightPane = currentItemId ? (
    <MatrixEditorView
      key={`${currentItemId}-${refreshTick}`}
      identifier={identifier}
      matrixId={currentItemId}
      renderRightPane={({ cell, matrix /*, closePane, updateCell, deleteCell */ }) => {
        return (
          <RightPaneRenderer
            setOpenCreateRequest={setOpenCreateRequest}
            setOpenCreatePreviousRequest={setOpenCreatePreviousRequest} // NEW
            setOpenCreateResponse={setOpenCreateResponse}
            setCurrentCell={setCurrentCell}
            handleDelete={handleDelete}
            cell={cell}
            matrix={matrix}
          />
        );
      }}
    />
  ) : (
    <Box sx={{ p: 4, color: "text.secondary" }}>
      <Typography>Select a matrix to edit.</Typography>
    </Box>
  );

  return (
    <>
      {singleMode ? (
        <Box sx={{ height: "100%", width: "100%" }}>
          {rightPane}
        </Box>
      ) : (
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
                      selected={currentItemId === matrix.id}
                    >
                      <ListItemButton onClick={() => setCurrentItemId(matrix.id)}>
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
          right={rightPane}
        />
      )}

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

      {/* ---- Create Previous Request Dialog (NEW) ---- */}
      <CrudDialogForm
        open={openCreatePreviousRequest}
        mode="create"
        initialValues={{}}
        fields={previousRequestFields}
        onSave={handleCreatePreviousRequest}
        onClose={() => setOpenCreatePreviousRequest(false)}
        titleCreate="Create Previous Request"
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
