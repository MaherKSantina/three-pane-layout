import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function collectLeafEntries(root) {
  const leaves = [];

  function walk(node, path) {
    if (Array.isArray(node)) {
      for (const item of node) {
        if (isPlainObject(item)) {
          leaves.push({ path, data: item });
        } else {
          walk(item, path);
        }
      }
      return;
    }

    if (isPlainObject(node)) {
      for (const [k, v] of Object.entries(node)) {
        walk(v, path.concat(k));
      }
    }
  }

  walk(root, []);
  return leaves;
}

function groupLeavesByPath(leaves) {
  const root = { label: "root", children: new Map(), items: [] };

  for (const leaf of leaves) {
    let cursor = root;
    for (const segment of leaf.path) {
      if (!cursor.children.has(segment)) {
        cursor.children.set(segment, { label: segment, children: new Map(), items: [] });
      }
      cursor = cursor.children.get(segment);
    }
    cursor.items.push(leaf.data);
  }

  return root;
}

function gatherAllLeafKeys(leaves) {
  const keys = new Set();
  for (const { data } of leaves) {
    for (const k of Object.keys(data)) keys.add(k);
  }
  return Array.from(keys).sort((a, b) => a.localeCompare(b));
}

function hasAnySelectedField(item, selectedFields) {
  if (selectedFields.length === 0) return true;
  return selectedFields.some((f) => Object.prototype.hasOwnProperty.call(item, f));
}

function renderTreeNode(node, selectedFields, depth = 0) {
  const children = Array.from(node.children.values());

  const renderedChildren = children
    .map((child) => renderTreeNode(child, selectedFields, depth + 1))
    .filter(Boolean);

  const visibleItems = node.items.filter((it) => hasAnySelectedField(it, selectedFields));

  if (visibleItems.length === 0 && renderedChildren.length === 0) return null;

  const showLabel = node.label !== "root";

  return (
    <Box key={`${node.label}-${depth}`} sx={{ pl: showLabel ? 2 : 0, mt: showLabel ? 1.25 : 0 }}>
      {showLabel && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{node.label}</Box>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
      )}

      {visibleItems.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 0.75 }}>
          {visibleItems.map((item, idx) => (
            <Paper
              key={`${node.label}-item-${idx}`}
              variant="outlined"
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "none",
              }}
            >
              {(selectedFields.length === 0 ? Object.keys(item) : selectedFields)
                .filter((k) => Object.prototype.hasOwnProperty.call(item, k))
                .map((k) => (
                  <Box key={k} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        opacity: 0.85,
                        mb: 0.5,
                      }}
                    >
                      {k}
                    </Box>
                    <Box
                      sx={{
                        fontSize: 16,
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {typeof item[k] === "string" ? item[k] : JSON.stringify(item[k], null, 2)}
                    </Box>
                  </Box>
                ))}
            </Paper>
          ))}
        </Box>
      )}

      {renderedChildren.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {renderedChildren}
        </Box>
      )}
    </Box>
  );
}

export default function JsonLeafTreeViewer({ data }) {
  const [selectedFields, setSelectedFields] = React.useState([]);

  const { allLeafKeys, tree } = React.useMemo(() => {
    const leaves = collectLeafEntries(data);
    const allLeafKeys = gatherAllLeafKeys(leaves);
    const tree = groupLeavesByPath(leaves);
    return { allLeafKeys, tree };
  }, [data]);

  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }}>
      <Grid container spacing={2} sx={{ width: "100%", height: "100%" }}>
        <Grid size={12} sx={{ height: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ overflowX: "auto", overflowY: "hidden" }}>
                <Stack direction="row" spacing={1} sx={{ width: "max-content", pr: 1 }}>
                  {allLeafKeys.map((k) => (
                    <Chip
                      key={k}
                      label={k}
                      clickable
                      onClick={() => toggleField(k)}
                      color={selectedFields.includes(k) ? "primary" : "default"}
                      variant={selectedFields.includes(k) ? "filled" : "outlined"}
                      size="medium"
                      sx={{ fontSize: 14, height: 36 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>

            <Box sx={{ height: "100%", overflow: "auto", px: 2, py: 2 }}>
              {renderTreeNode(tree, selectedFields)}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
