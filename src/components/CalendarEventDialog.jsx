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
  });

  useEffect(() => {
    if (initialData) {
      const start = DateTime.fromISO(initialData.start.toISOString(), { zone: 'utc' }).setZone(timeZone);
      const end = DateTime.fromISO(initialData.end.toISOString(), { zone: 'utc' }).setZone(timeZone);

      setForm({
        title: initialData.title || '',
        start: start.toFormat("yyyy-MM-dd'T'HH:mm"),
        end: end.toFormat("yyyy-MM-dd'T'HH:mm"),
        description: initialData.description || '',
      });
    } else {
      setForm({ title: '', start: '', end: '', description: '' });
    }
  }, [initialData, timeZone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const startUtc = DateTime.fromFormat(form.start, "yyyy-MM-dd'T'HH:mm", { zone: timeZone }).toUTC();
    const endUtc = DateTime.fromFormat(form.end, "yyyy-MM-dd'T'HH:mm", { zone: timeZone }).toUTC();

    onSave({
      id: initialData?.id,
      title: form.title,
      description: form.description,
      start: startUtc.toISO(),
      end: endUtc.toISO(),
      timeZone,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Event' : 'New Event'}</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        {initialData ? <Button onClick={() => onDelete?.(initialData.id)} variant="contained">Delete</Button> : null}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
