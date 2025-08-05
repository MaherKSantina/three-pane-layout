import { useEffect, useState } from "react";
import SplitPane from "./SplitPane3";
import { List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { MatrixEditorView } from "./MatrixEditorView";

export default function MatrixListWithDetails() {
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("https://api-digitalsymphony.ngrok.pizza/api/matrices")
      .then(res => setMatrices(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
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
              {matrices.map(matrix => (
                <ListItem
                  key={matrix.id}
                  disablePadding
                  selected={currentItem?.id === matrix.id}
                >
                  <ListItemButton onClick={() => setCurrentItem(matrix)}>
                    <ListItemText primary={matrix.name} secondary={`ID: ${matrix.id}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      }
      right={
        currentItem ? (
          <MatrixEditorView matrixId={currentItem.id} />
        ) : (
          <Box sx={{ p: 4, color: "text.secondary" }}>
            <Typography>Select a matrix to edit.</Typography>
          </Box>
        )
      }
    />
  );
}
