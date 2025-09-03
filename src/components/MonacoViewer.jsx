// --- MonacoViewer.tsx (read-only) ---
import * as React from 'react';
import { Box } from '@mui/material';
import { Editor } from '@monaco-editor/react';

function tryPrettyJson(input) {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      // Only pretty-print if it was valid JSON
      return { text: JSON.stringify(parsed, null, 2), language: 'json' };
    } catch {
      // not JSON
      return { text: String(input ?? ''), language: 'plaintext' };
    }
  }
  // Non-string: stringify per request
  try {
    return { text: JSON.stringify(input, null, 2), language: 'json' };
  } catch {
    return { text: String(input ?? ''), language: 'plaintext' };
  }
}

export default function MonacoViewer({ value }) {
  const { text, language } = React.useMemo(() => tryPrettyJson(value), [value]);

  return (
    <Box sx={{ height: '100%', display: 'grid', size: 'grow' }}>
      <Editor
        height="100%"
        language={language === 'plaintext' ? 'yaml' : language /* default to yaml-style for non-JSON */}
        value={text}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Box>
  );
}
