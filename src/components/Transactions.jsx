import React, { useEffect, useState } from 'react';

import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import { matchesCategory } from '../utils/transactionsMatch';
import { useTransactionsStore } from '../stores/useTransactionsStore';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: '#ced7e0',
  borderRadius: '4px',
  marginBottom: '8px',
  padding: '8px',
  ...theme?.applyStyles?.('dark', { borderColor: '#444d58' }),
}));

function fetchTransactions() {
  // Replace with your real fetch, or mock here
  return fetch('https://api-digitalsymphony.ngrok.pizza/transactions').then((res) => res.json());
}

export default function TransactionsCategorizer() {
  const {
    transactions,
    setTransactions,
    categories,
    addCategory,
    updateCategoryRules,
  } = useTransactionsStore();

  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    fetchTransactions().then(setTransactions);
  }, [setTransactions]);

  // Categorize
  const categorizedIds = new Set();
  const categoryMatches = categories.map((cat) => {
    const matches = transactions.filter((tx) => {
      const matched = matchesCategory(tx, cat);
      if (matched) categorizedIds.add(tx.id);
      return matched;
    });
    return { ...cat, matches };
  });
  const uncategorized = transactions.filter((tx) => !categorizedIds.has(tx.id));

  // Add Category
  const handleAddCategory = () => {
    if (!newCatName) return;
    addCategory({
      id: Date.now().toString(),
      name: newCatName,
      rulesType: 'and',
      rules: [],
    });
    setNewCatName('');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={4}>
        {/* Categories with their matched transactions */}
        <Grid size={8}>
          <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 20 }}>
            Categories
          </Box>
          <Box>
            {categoryMatches.map((cat) => (
              <Box key={cat.id} sx={{ mb: 2 }}>
                <Item>
                  <strong>{cat.name}</strong>
                  <RulesEditor
                    category={cat}
                    onUpdate={(rules, rulesType) =>
                      updateCategoryRules(cat.id, rules, rulesType)
                    }
                  />
                  <Box sx={{ mt: 1 }}>
                    {cat.matches.length ? (
                      <Box>
                        <Box>Matched transactions:</Box>
                        <ul>
                          {cat.matches.map((tx) => (
                            <li key={tx.id}>
                              {tx.date} - {tx.description} - ${tx.amount}
                            </li>
                          ))}
                        </ul>
                      </Box>
                    ) : (
                      <Box>No matches yet.</Box>
                    )}
                  </Box>
                </Item>
              </Box>
            ))}
          </Box>
          {/* Add Category */}
          <Box sx={{ mt: 2 }}>
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name"
            />
            <button onClick={handleAddCategory}>Add Category</button>
          </Box>
        </Grid>
        {/* Uncategorized transactions */}
        <Grid size={4}>
          <Box sx={{ fontWeight: 'bold', fontSize: 20, mb: 2 }}>
            Uncategorized Transactions
          </Box>
          <Item>
            <ul>
              {uncategorized.map((tx) => (
                <li key={tx.id}>
                  {tx.date} - {tx.description} - ${tx.amount}
                </li>
              ))}
            </ul>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

// RulesEditor: Minimal rule editor for demo
function RulesEditor({ category, onUpdate }) {
  const [rules, setRules] = useState(category.rules || []);
  const [rulesType, setRulesType] = useState(category.rulesType || 'and');

  // For adding a new rule
  const [field, setField] = useState('description');
  const [op, setOp] = useState('equals');
  const [value, setValue] = useState('');

  const handleAddRule = () => {
    setRules([...rules, { field, op, value }]);
    setValue('');
  };
  const handleRemoveRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };
  const handleSave = () => {
    onUpdate(rules, rulesType);
  };

  useEffect(() => {
    setRules(category.rules || []);
    setRulesType(category.rulesType || 'and');
  }, [category]);

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box>
        Match type:
        <select
          value={rulesType}
          onChange={(e) => setRulesType(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
      </Box>
      <Box>
        {rules.map((rule, idx) => (
          <Box key={idx} sx={{ mt: 1 }}>
            {rule.field} {rule.op} "{rule.value}"
            <button onClick={() => handleRemoveRule(idx)} style={{ marginLeft: 8 }}>
              Remove
            </button>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 1 }}>
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="description">Description</option>
          <option value="amount">Amount</option>
        </select>
        <select value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="equals">equals</option>
          <option value="contains">contains</option>
          <option value="gt">{'>'}</option>
          <option value="lt">{'<'}</option>
        </select>
        <input
          value={value}
          placeholder="Value"
          onChange={(e) => setValue(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button onClick={handleAddRule} style={{ marginLeft: 8 }}>
          Add Rule
        </button>
        <button onClick={handleSave} style={{ marginLeft: 8 }}>
          Save Rules
        </button>
      </Box>
    </Box>
  );
}
