import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Autocomplete,
  InputAdornment,
  IconButton
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { DateTime } from "luxon";

// Helper: always get a Luxon DateTime from value (Date, string, or null)
function toLuxon(value) {
  if (!value) return null;
  if (typeof value === "string") return DateTime.fromISO(value);
  if (value instanceof Date) return DateTime.fromJSDate(value);
  return null;
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {function} props.onSubmit
 * @param {string|number|null} props.taskId
 * @param {function} props.getTask - from store
 * @param {array} props.parentTasks
 * @param {boolean} props.editing
 */
export function TaskForm({
  open,
  onClose,
  onSubmit,
  taskId,
  getTask,
  parentTasks = [],
  editing,
  parent = null
}) {
  const [values, setValues] = useState({
    text: "",
    start_date: "",
    end_date: "",
    duration: "",
    progress: 0,
    parent: null,
  });

  async function hydrateTask() {
    let task = await getTask(taskId)
    setValues({
        text: task?.text || "",
        start_date: task?.start_date
          ? toLuxon(task.start_date).toFormat("yyyy-MM-dd'T'HH:mm")
          : "",
        end_date: task?.end_date
          ? toLuxon(task.end_date).toFormat("yyyy-MM-dd'T'HH:mm")
          : "",
        duration: task?.duration ?? "",
        progress: task?.progress ?? 0,
        parent: task?.parent ?? null,
      });
  }

  useEffect(() => {
    if (editing && taskId && typeof getTask === "function") {
      hydrateTask(taskId)
    } else {
        setValues({
            parent
        })
    }
    // eslint-disable-next-line
  }, [taskId, open, getTask, editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateLuxon = values.start_date
      ? DateTime.fromFormat(values.start_date, "yyyy-MM-dd'T'HH:mm")
      : null;
    const endDateLuxon = values.end_date
      ? DateTime.fromFormat(values.end_date, "yyyy-MM-dd'T'HH:mm")
      : null;

    onSubmit({
      ...values,
      start_date: startDateLuxon ? startDateLuxon.toISO() : null,
      end_date: endDateLuxon ? endDateLuxon.toISO() : null,
      duration: values.duration ? Number(values.duration) : null,
      progress: values.progress ? Number(values.progress) : 0,
      parent: values.parent ? values.parent : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Edit Task" : "Create Task"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="text"
            label="Task Name"
            value={values.text}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="start_date"
            label="Start Date"
            type="datetime-local"
            value={values.start_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
                endAdornment: values.start_date && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear date"
                        onClick={() =>
                          setValues((v) => ({ ...v, start_date: "" }))
                        }
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
            }}
          />
          <TextField
            margin="dense"
            name="end_date"
            label="End Date"
            type="datetime-local"
            value={values.end_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
                endAdornment: values.end_date && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear date"
                        onClick={() =>
                          setValues((v) => ({ ...v, end_date: "" }))
                        }
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
            }}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (hours)"
            type="number"
            value={values.duration}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="progress"
            label="Progress (0-1)"
            type="number"
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            value={values.progress}
            onChange={handleChange}
            fullWidth
          />
          <Autocomplete
            options={parentTasks}
            getOptionLabel={(option) => option.text || ""}
            value={parentTasks.find(t => t.id === values.parent) || null}
            onChange={(_, val) => setValues((v) => ({ ...v, parent: val ? val.id : null }))}
            renderInput={(params) => (
              <TextField {...params} label="Parent Task (optional)" margin="dense" fullWidth />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
