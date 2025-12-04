// GenericDataTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import styled from "@mui/system/styled";
import { Button, TextField } from "@mui/material";
import DataTableView from "./DataTable"; // your existing table wrapper

const Item = styled("div")(({ theme }) => ({
  border: "1px solid",
  borderColor: "#ced7e0",
  borderRadius: "4px",
  padding: 8,
  ...theme.applyStyles?.("dark", {
    borderColor: "#444d58",
  }),
}));

const ExpandedComponent = ({ data }) => (
  <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
    {JSON.stringify(data, null, 2)}
  </pre>
);

function normalizeCell(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function detectColumns(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const keys = Object.keys(rows[0] ?? {});
  return keys.map((key) => ({
    name: key,
    selector: (row) => row?.[key],
    sortable: true,
    // grow if this looks like a "description/body/json" field
    grow: /desc|body|json|message|text/i.test(key) ? 4 : undefined,
    sortFunction: (a, b) => {
      const va = a?.[key];
      const vb = b?.[key];
      const na = Number(va);
      const nb = Number(vb);
      const aNum = !Number.isNaN(na);
      const bNum = !Number.isNaN(nb);
      if (aNum && bNum) return na - nb;
      return normalizeCell(va).localeCompare(normalizeCell(vb), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    },
  }));
}

export default function GenericDataTable({
  items = [],
  title = "Data",
  onRefresh,
}) {
  const [search, setSearch] = useState("");
  const cols = useMemo(() => detectColumns(items), [items]);

  const filtered = useMemo(() => {
    if (!search) return items ?? [];
    const q = search.toLowerCase();
    return (items ?? []).filter((row) =>
      cols.some((c) => normalizeCell(c.selector(row)).toLowerCase().includes(q))
    );
  }, [items, cols, search]);

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <strong style={{ fontSize: 16 }}>{title}</strong>
            {onRefresh && (
              <Button size="small" onClick={onRefresh}>
                Refresh
              </Button>
            )}
          </Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <TextField
              fullWidth
              size="small"
              placeholder="Search across all columns…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Item>
        </Grid>
      </Grid>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataTableView
          columns={cols.length ? cols : [{ name: "value", selector: (r) => JSON.stringify(r) }]}
          data={filtered}
          dense
          highlightOnHover
          pagination={false}
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 280px)"
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </Box>
    </Box>
  );
}
