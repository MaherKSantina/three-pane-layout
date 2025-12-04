import { useCallback, useEffect, useState } from 'react';
import MonacoViewer from '../MonacoViewer';
import ChattableComponent from './ChattableComponent';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Calendar from '../Calendar2';
import GanttChart from '../GanttChart';
import { ParentSize } from './ParentSize';

export default function APIChattableComponent() {
  const [layout, setLayout] = useState(null);
  const [messages, setMessages] = useState([]);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("")

  const handleTextChange = useCallback((next) => {
    setMessage(next);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  async function sendMessage(msg, messagesForRequest, layoutForRequest) {
    if(selectedIndex != null) {
        let newMessages = [...messages]
        newMessages.splice(selectedIndex + 1, 0, msg)
        setMessages(newMessages)
    } else {
        try {
        const response = await axios.post(
        `https://api-digitalsymphony.ngrok.pizza/focus/sendMessage`,
        {
            previousMessages: messagesForRequest,
            previousLayout: layoutForRequest,
            message: {
            ...msg,
            timestamp: Date.now(),
            },
        }
        );
        setLayout(response.data.layout);
        setMessages(response.data.messages);
    } catch(error) {
        setError(error)
        setOpen(true)
        setMessage(msg.text)
    }
    }
  }

  function getComponent() {
    if (layout) {
      if (layout.type === "monaco") {
        return <MonacoViewer value={layout.text} readOnly />;
      } else if(layout.type === "calendar") {
        return <ParentSize>
            {({width, height}) => {
                return <Calendar events={layout.data} slotDuration={"00:10:00"} style={{width, height}}></Calendar>
            }}
        </ParentSize>
        
      } else if(layout.type === "gantt") {
        const {tasks, links} = layout.data
        return <ParentSize>
            {({width, height}) => (
                <GanttChart tasks={tasks} links={links} height={height}></GanttChart>
            )}
        </ParentSize>
      }
    }
    return null;
  }

  // Open edit dialog with the selected message text
  function handleOpenEdit(index) {
    const msg = messages[index];
    if (!msg) return;
    setEditIndex(index);
    setEditText(msg.text ?? "");
    setEditOpen(true);
  }

  function handleCloseEdit() {
    setEditOpen(false);
    setEditIndex(null);
    setEditText("");
  }

  // Save edited text, update messages, and execute
  async function handleSaveEdit() {
    if (editIndex == null) return;

    // 1) Update the message text locally
    const updatedMessages = messages.map((m, i) =>
      i === editIndex ? { ...m, text: editText } : m
    );

    setMessages(updatedMessages)

    // 2) Execute with edited message
    await sendMessage(updatedMessages[messages.length - 1], updatedMessages.slice(0, updatedMessages.length - 1), layout);

    handleCloseEdit();
  }

  return (
    <>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {JSON.stringify(error, null, 2)}
        </Alert>
      </Snackbar>
      <ChattableComponent
        messages={messages}
        input={message}
        onChange={handleTextChange}
        onSendMessage={() => {
            let m = message
            setMessage("")
          sendMessage({type: "text", text: m, isResponse: true}, messages, layout);
        }}
        sendMode="text"
        component={getComponent()}
        onRefresh={() => {}}
        onMessageOptions={async (option, index) => {
          if (option === "restart") {
            const shouldExecute = { ...messages[index] };
            let newMessages = [...messages];
            newMessages = newMessages.reverse();
            newMessages = newMessages.slice(messages.length - index);
            newMessages = newMessages.reverse();
            sendMessage(shouldExecute, newMessages, layout);
          } else if (option === "execute") {
            const shouldExecute = { ...messages[index] };
            const copy = [...messages];
            let newMessages = [...messages];
            newMessages = newMessages.reverse();
            newMessages = newMessages.slice(messages.length - index);
            newMessages = newMessages.reverse();
            await sendMessage(shouldExecute, newMessages, layout);
            setMessages(copy);
          } else if (option === "edit") {
            handleOpenEdit(index);
          } else if(option === "delete") {
            let newMessages = [...messages]
            newMessages.splice(index, 1)
            setMessages(newMessages)
          } else if(option === "select") {
            if(index === messages.length - 1) {
                setSelectedIndex(null)
            } else {
                setSelectedIndex(index)
            }
          }
        }}
        shouldFocus={!editOpen}
      />

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            margin="dense"
            label="Message"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save &amp; execute
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}