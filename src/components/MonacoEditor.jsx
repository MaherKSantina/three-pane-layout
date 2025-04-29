import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Box, Button } from '@mui/material';

function MonacoEditor({ value = '', onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  const handleEditorChange = (newValue) => {
    setLocalValue(newValue);
  };

  const handleSave = () => {
    if (onChange) {
      onChange(localValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Editor
          height="100%"
          language="yaml"
          defaultValue={value}
          value={localValue}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </Box>
      <Box sx={{ p: 1, textAlign: 'right' }}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default MonacoEditor;
