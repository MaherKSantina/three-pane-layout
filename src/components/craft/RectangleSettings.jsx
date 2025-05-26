import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Stack } from "@mui/material";
import { useNode } from "@craftjs/core";
import dayjs from "dayjs";

export function CraftableRectangleSettings() {
  const {
    actions: { setProp },
    startDate,
    endDate,
  } = useNode((node) => ({
    startDate: node.data.props.startDate,
    endDate: node.data.props.endDate,
  }));

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <DatePicker
        label="Start Date"
        value={startDate ? dayjs(startDate) : null}
        onChange={(newValue) =>
          setProp((props) => (props.startDate = newValue?.toISOString() || ""))
        }
        slotProps={{ textField: { fullWidth: true } }}
      />
      <DatePicker
        label="End Date"
        value={endDate ? dayjs(endDate) : null}
        onChange={(newValue) =>
          setProp((props) => (props.endDate = newValue?.toISOString() || ""))
        }
        slotProps={{ textField: { fullWidth: true } }}
      />
    </Stack>
  );
}
