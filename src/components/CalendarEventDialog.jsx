// CalendarEventDialog.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from '@mui/material';

const { DateTime } = require('luxon');

export default function CalendarEventDialog({ open, onClose, initialData, onSave, timeZone, onDelete }) {
  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    definitionKey: '',
    args: ''
  });

  useEffect(() => {
    if (initialData) {
      let start = ""
      if(initialData.start) {
        start = DateTime.fromISO(initialData.start.toISOString(), { zone: 'utc' }).setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm");
      }

      let end = ""
      if(initialData.end) {
        end = DateTime.fromISO(initialData.end.toISOString(), { zone: 'utc' }).setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm");
      }

      let args = ""
      if(initialData.args) {
        args = JSON.stringify(initialData.args)
      }
      

      setForm({
        title: initialData.title || '',
        start,
        end,
        description: initialData.description || '',
        definitionKey: initialData.definitionKey || '',
        args
      });
    } else {
      setForm({ title: '', start: '', end: '', description: '', definitionKey: '',  args: ''});
    }
  }, [initialData, timeZone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    function removingEmpty(field) {
      return field === '' ? null : field
    }
    function getNotEmptyDate(field) {
      return field === '' ? null : DateTime.fromFormat(field, "yyyy-MM-dd'T'HH:mm", { zone: timeZone }).toUTC()
    }

    onSave({
      id: initialData?.id,
      title: removingEmpty(form.title),
      description: removingEmpty(form.description),
      start: getNotEmptyDate(form.start)?.toISO(),
      end: getNotEmptyDate(form.end)?.toISO(),
      timeZone,
      definitionKey: removingEmpty(form.definitionKey),
      args: removingEmpty(form.args) ? JSON.parse(form.args) : null
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? initialData.id : 'New Event'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title" name="title" fullWidth margin="dense"
          value={form.title} onChange={handleChange}
        />
        <TextField
          label="Start" name="start" type="datetime-local" fullWidth margin="dense"
          value={form.start} onChange={handleChange}
        />
        <TextField
          label="End" name="end" type="datetime-local" fullWidth margin="dense"
          value={form.end} onChange={handleChange}
        />
        <TextField
          label="Description" name="description" fullWidth margin="dense"
          value={form.description} onChange={handleChange}
        />
        <TextField
          label="Definition Key" name="definitionKey" fullWidth margin="dense"
          value={form.definitionKey} onChange={handleChange}
        />
        <TextField
          label="Args" name="args" fullWidth margin="dense"
          value={form.args} onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        {initialData ? <Button onClick={() => onDelete?.(initialData.id)} variant="contained">Delete</Button> : null}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
