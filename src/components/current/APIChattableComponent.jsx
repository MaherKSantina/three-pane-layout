import { useEffect, useState } from 'react';
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
import Calendar from '../Calendar2';
import { useParams } from 'react-router-dom';

export default function APIChattableComponent() {
  const [layout, setLayout] = useState(null);
  const [messages, setMessages] = useState([]);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  async function sendMessage(msg, messagesForRequest, layoutForRequest) {
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
    return true;
  }

  function CalendarPage() {
    const [data, setData] = useState([])
  
    useEffect(() => {
        reloadData()
      }, [])
  
    async function reloadData() {
        let response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/data/current/calendar`)
        setData(response.data)
      }
  
    return (
      <Calendar events={data} slotDuration={"00:10:00"}></Calendar>
    );
  }

  function getComponent() {
    if (layout) {
      if (layout.type === "monaco") {
        return <MonacoViewer value={layout.text} readOnly />;
      } else if(layout.type === "calendar") {
        return <CalendarPage></CalendarPage>
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
      <ChattableComponent
        messages={messages}
        onSendMessage={(msg) => {
          sendMessage(msg, messages, layout);
        }}
        sendMode="text"
        component={getComponent()}
        onRefresh={() => {
          setLayout(null);
          setMessages([]);
        }}
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