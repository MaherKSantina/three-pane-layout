// File: components/RemoteAutocomplete.jsx
import React from "react";
import axios from "axios";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

/**
 * Props:
 * - open: boolean (parent dialog open state)
 * - getUrl: string (endpoint to GET items)
 * - value: number|null (selected id)
 * - onChange: (idOrNull) => void
 * - label?: string
 * - getLabel?: (item) => string   // default: "id — type — key"
 * - placeholder?: string
 */
export default function RemoteAutocomplete({
  open,
  getUrl,
  value,
  onChange,
  label,
  getLabel,
  placeholder,
}) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const defaultLabel = (it) => {
    const id = it?.id ?? "";
    const type = it?.type ?? "";
    const key = it?.key ?? "";
    return [id, type, key].filter(Boolean).join(" — ");
  };

  // Fetch once per open (and again on the next open). No AbortController.
  React.useEffect(() => {
    if (!open || !getUrl) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(getUrl);
        const list = Array.isArray(res.data) ? res.data : [];
        if (mounted) setItems(list);
      } catch (e) {
        if (mounted) {
          const msg = e?.response ? `HTTP ${e.response.status}` : (e?.message || "Failed to load");
          setError(msg);
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      // Optional: reset search each close so next open starts fresh
      setInputValue("");
    };
  }, [open, getUrl]);

  // Selected value as item
  const selected = React.useMemo(
    () => items.find((it) => String(it?.id) === String(value)) || null,
    [items, value]
  );

  // Simple client-side filter by label
  const filtered = React.useMemo(() => {
    if (!inputValue) return items;
    const q = inputValue.toLowerCase();
    return items.filter((it) => (getLabel ? getLabel(it) : defaultLabel(it)).toLowerCase().includes(q));
  }, [items, inputValue, getLabel]);

  return (
    <Autocomplete
      options={filtered}
      loading={loading}
      value={selected}
      onChange={(_, item) => onChange(item)}
      inputValue={inputValue}
      onInputChange={(_, val) => setInputValue(val || "")}
      getOptionLabel={(it) => (it ? (getLabel ? getLabel(it) : defaultLabel(it)) : "")}
      isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
      clearOnEscape
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={error ? `Failed to load: ${error}` : "Optional"}
          error={!!error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
