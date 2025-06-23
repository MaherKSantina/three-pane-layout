import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import styled from "@mui/system/styled";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TransactionList from "./TransactionList";

const RuleBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  border: "1px solid #ced7e0",
  borderRadius: "6px",
  background: "#f9fbfc",
  marginBottom: 8,
  ...theme?.applyStyles?.("dark", { background: "#232b33", borderColor: "#444d58" }),
}));

function matchTransaction(tx, rules) {
  return rules.every((rule) => {
    const desc = tx.description || "";
    if (rule.type === "equals") {
      return desc === rule.value;
    } else if (rule.type === "contains") {
      return desc.toLowerCase().includes(rule.value.toLowerCase());
    }
    return false;
  });
}

export default function RuleBasedTransactionMatcher({ transactions }) {
  const [rules, setRules] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState(null);

  // For the dialog form
  const [formType, setFormType] = React.useState("contains");
  const [formValue, setFormValue] = React.useState("");

  const handleOpenDialog = (ruleIdx = null) => {
    if (ruleIdx !== null) {
      setEditingRule(ruleIdx);
      setFormType(rules[ruleIdx].type);
      setFormValue(rules[ruleIdx].value);
    } else {
      setEditingRule(null);
      setFormType("contains");
      setFormValue("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRule(null);
    setFormType("contains");
    setFormValue("");
  };

  const handleAddOrEditRule = () => {
    const newRule = { type: formType, value: formValue.trim() };
    if (!newRule.value) return;
    if (editingRule !== null) {
      // Edit existing rule
      const newRules = [...rules];
      newRules[editingRule] = newRule;
      setRules(newRules);
    } else {
      // Add new rule
      setRules([...rules, newRule]);
    }
    handleCloseDialog();
  };

  const handleDeleteRule = (idx) => {
    setRules((prev) => prev.filter((_, i) => i !== idx));
  };

  // Get matched transactions
  const matchedTransactions = React.useMemo(
    () => transactions.filter((tx) => matchTransaction(tx, rules)),
    [transactions, rules]
  );
  const total = React.useMemo(
    () => matchedTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
    [matchedTransactions]
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: 0,
        minWidth: 0,
        p: 0,
        m: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        bgcolor: "background.default",
      }}
    >
      {/* Rules and add button at the top */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ mb: 2, fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>
          Matching Rules
        </Box>
        <Box sx={{ mb: 2 }}>
          {rules.length === 0 && (
            <Box sx={{ color: "#888", fontStyle: "italic" }}>
              No rules yet. Add your first rule!
            </Box>
          )}
          {rules.map((rule, idx) => (
            <RuleBox key={idx}>
              <Box sx={{ flex: 1 }}>
                Description <b>{rule.type}</b> <b>"{rule.value}"</b>
              </Box>
              <IconButton
                size="small"
                aria-label="Edit"
                sx={{ ml: 1 }}
                onClick={() => handleOpenDialog(idx)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Delete"
                sx={{ ml: 1 }}
                onClick={() => handleDeleteRule(idx)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </RuleBox>
          ))}
        </Box>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: "8px" }}
        >
          Add Rule
        </Button>
      </Box>

      {/* Matched transactions in the center, fills remaining height */}
      <Box sx={{
        flex: 1,
        minHeight: 0,
        px: 3,
        pb: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <Box sx={{ fontWeight: 700, fontSize: 18, mb: 2 }}>
          Matched Transactions ({matchedTransactions.length})
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TransactionList transactions={matchedTransactions} />
        </Box>
        {/* Total at bottom */}
        <Box
          sx={{
            mt: 2,
            fontSize: 18,
            fontWeight: 600,
            textAlign: "right"
          }}
        >
          Total: ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Box>
      </Box>

      {/* Rule Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingRule !== null ? "Edit Rule" : "Add Rule"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", gap: 2, mt: 1, flexDirection: "column" }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddOrEditRule();
            }}
          >
            <TextField
              select
              label="Type"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              size="small"
            >
              <MenuItem value="contains">Contains</MenuItem>
              <MenuItem value="equals">Equals</MenuItem>
            </TextField>
            <TextField
              label="Match text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              size="small"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddOrEditRule}
            variant="contained"
            disabled={!formValue.trim()}
          >
            {editingRule !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
