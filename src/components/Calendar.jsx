// Calendar.jsx
import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';
import CalendarEventDialog from './CalendarEventDialog';
import { useStore } from '../contexts/StoreContext';

const { DateTime } = require('luxon');

function convertToISOWithTimezone(dateString, targetTimeZone) {
  const date = DateTime.fromISO(dateString);
  const dateInTargetZone = date.setZone(targetTimeZone);
  const localOffset = DateTime.local().toFormat('ZZ');
  const formattedDate = dateInTargetZone.toISO({ includeOffset: false }) + localOffset;
  return new Date(formattedDate);
}

export function Calendar({ timeZone = "Australia/Sydney", initialDate, itemID, slotDuration = "00:10:00" }) {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [events, setEvents] = useState([])

  const calendarRef = useRef(null);

  const fetchEvents = async () => {
    const res = await fetch(`http://localhost:3000/items/${itemID}/calendar-tasks/compiled`);
    const data = await res.json();
    setEvents(data);
  }

  const addEvent = async (event) => {
    await fetch(`http://localhost:3000/items/${itemID}/calendar-tasks`, {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json" },
    });
    await fetchEvents()
  }

  const updateEvent = async (id, updates) => {
    await fetch(`http://localhost:3000/calendar-tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" },
    });
    await fetchEvents()
  }

  const deleteEvent = async (id) => {
    await fetch(`http://localhost:3000/calendar-tasks/${id}`, {
      method: "DELETE",
    });
    await fetchEvents()
  }

  useEffect(() => {
    if(!itemID) return
    fetchEvents()
  }, [itemID])

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(initialDate || new Date());
    }
  }, [initialDate]);

  const handleEventClick = (eventInfo) => {
    setEditData({
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      description: eventInfo.event.extendedProps.description || '',
    });
    setEditOpen(true);
  };

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, [events]);

  const handleSaveEvent = (event) => {
    if (event.id) {
      updateEvent(event.id, event);
    } else {
      addEvent({ ...event, id: Date.now().toString() });
    }
  };

  const handleDeleteEvent = async (id) => {
    deleteEvent(id)
    setEditOpen(false);
    setSelectedEvent(null);
  };

  const handleAddNew = () => {
    setEditData(null);
    setEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ m: 2, height: "calc(100vh - 64px)", overflowY: "auto" }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button onClick={fetchEvents} variant="contained">Refresh</Button>
        <Button onClick={handleAddNew} variant="contained">New Event</Button>
      </Box>

      <FullCalendar
      slotDuration={slotDuration}
      eventOverlap={false}
        ref={calendarRef}
        plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        height="auto"
        contentHeight="auto"
        expandRows={true}
        initialDate={initialDate}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'today dayGridMonth timeGridWeek listWeek prev,next',
        }}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        events={(info, successCallback, failureCallback) => {
          try {
            const converted = events.map((x) => ({
              ...x,
              start: convertToISOWithTimezone(x.start, x.startTimeZone ?? x.timeZone ?? timeZone),
              end: convertToISOWithTimezone(x.end, x.endTimeZone ?? x.timeZone ?? timeZone),
              description: x.description,
            }));
            successCallback(converted);
          } catch (err) {
            failureCallback(err);
          }
        }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="body1"><strong>Start:</strong> {selectedEvent.start?.toLocaleString()}</Typography>
              <Typography variant="body1"><strong>End:</strong> {selectedEvent.end?.toLocaleString()}</Typography>
              {Object.entries(selectedEvent.extendedProps).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {value ? value.toString() : 'N/A'}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <CalendarEventDialog
        open={editOpen}
        initialData={editData}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        timeZone={timeZone}
      />
    </Box>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      <div dangerouslySetInnerHTML={{__html: eventInfo.event.extendedProps.description}}></div>
    </>
  );
}

export default Calendar;
