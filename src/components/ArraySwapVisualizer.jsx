import React, { useState } from 'react';
import { Box, Slider, Grid, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const defaultBoxStyle = {
  borderRadius: 8,
  padding: 2,
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '2px solid #ccc',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.3s ease',
};

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 80%)`;
};

export default function ArrayStateVisualizer({ steps }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedObjs, setSelectedObjs] = useState(new Set());
  const [objColors, setObjColors] = useState(new Map());

  const currentStep = steps[stepIndex] || {};
  const prevStep = steps[stepIndex - 1] || {};

  const toggleSelection = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    setSelectedObjs((prev) => {
      const newSet = new Set(prev);
      const newMap = new Map(objColors);
      if (newSet.has(obj)) {
        newSet.delete(obj);
      } else {
        newSet.add(obj);
        if (!newMap.has(obj)) newMap.set(obj, getRandomColor());
      }
      setObjColors(newMap);
      return newSet;
    });
  };

  const getHighlightColor = (obj) => {
    if (!obj || typeof obj !== 'object') return '#f0f0f0';

    if (selectedObjs.has(obj)) {
      return objColors.get(obj) || '#90caf9';
    }

    if (obj.isHighlighted) {
      return obj.highlightColor;
    }

    return '#f0f0f0';
  };

  const isChanged = (key, value) => {
    const prev = prevStep[key];
    if (Array.isArray(value)) return false;
    if (!prev) return false;
    return prev.value !== value?.value;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Algorithm Visualizer
      </Typography>

      <Slider
        min={0}
        max={steps.length - 1}
        value={stepIndex}
        onChange={(e, newVal) => setStepIndex(newVal)}
        step={1}
        marks
        sx={{ mb: 4 }}
      />

      <Stack spacing={2}>
        {Object.entries(currentStep).map(([key, value]) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Name column */}
            <Box sx={{ width: 80 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, pt: '10px' }}
              >
                {key}
              </Typography>
            </Box>

            {/* Value column */}
            <Grid container spacing={1} wrap="nowrap">
              {(Array.isArray(value) ? value : [value]).map((obj, idx) =>
                obj ? (
                  <motion.div
                    key={obj.id}
                    layoutId={obj.id}
                    animate={{
                      scale:
                        !Array.isArray(value) && isChanged(key, value)
                          ? 1.05
                          : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    onClick={() => toggleSelection(obj)}
                  >
                    <Box
                      sx={{
                        ...defaultBoxStyle,
                        backgroundColor: getHighlightColor(obj),
                      }}
                    >
                      {obj.value}
                    </Box>
                  </motion.div>
                ) : (
                  <Box
                    key={`null-${idx}`}
                    sx={{ ...defaultBoxStyle, opacity: 0.3 }}
                  >
                    null
                  </Box>
                )
              )}
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
