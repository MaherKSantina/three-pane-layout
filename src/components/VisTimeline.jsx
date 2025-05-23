import React, { useEffect, useRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { useTimelineStore } from "../contexts/StoreContext";
import Button from '@mui/material/Button';

// Single integrated component
const VisTimeline = ({ width, height }) => {
  const timelineRef = useRef(null);
  const visTimeline = useRef(null);
  const { groups, items, addItem } = useTimelineStore();

  // Keep DataSet instances alive for the lifetime of the component
  const groupsDataSet = useRef(new DataSet());
  const itemsDataSet = useRef(new DataSet());

  // Keep the current window for zoom/scroll state
  const windowState = useRef(null);

  // Initialize timeline once
  useEffect(() => {
    if (!height || !width || !timelineRef.current) return;

    // If previous instance exists, get current window before destroy
    if (visTimeline.current) {
      try {
        windowState.current = visTimeline.current.getWindow();
      } catch (e) {
        windowState.current = null;
      }
    }

    const options = {
      stack: true,
      horizontalScroll: true,
      verticalScroll: true,
      zoomKey: 'ctrlKey',
      orientation: 'top',
      selectable: true,
      minHeight: height,
      maxHeight: height,
    };

    visTimeline.current = new Timeline(
      timelineRef.current,
      itemsDataSet.current,
      groupsDataSet.current,
      options
    );

    // Restore window position if it exists
    if (windowState.current) {
      visTimeline.current.setWindow(windowState.current.start, windowState.current.end, { animation: false });
    }

    // ResizeObserver to handle container resizing
    const resizeObserver = new ResizeObserver(() => {
      visTimeline.current?.redraw();
      // Restore window position on redraw (in case vis resets it)
      if (windowState.current) {
        visTimeline.current.setWindow(windowState.current.start, windowState.current.end, { animation: false });
      }
    });
    resizeObserver.observe(timelineRef.current);

    return () => {
      // Save window before destroy
      if (visTimeline.current) {
        try {
          windowState.current = visTimeline.current.getWindow();
        } catch (e) {
          windowState.current = null;
        }
      }
      resizeObserver.disconnect();
      visTimeline.current?.destroy();
    };
  }, [height, width]);

  // Update groups efficiently (clear + add for compatibility)
  useEffect(() => {
    groupsDataSet.current.clear();
    groupsDataSet.current.add(groups);
  }, [groups]);

  // Update items efficiently (clear + add for compatibility)
  useEffect(() => {
    itemsDataSet.current.clear();
    itemsDataSet.current.add(items);
  }, [items]);

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <div ref={timelineRef} style={{ width: '100%', height: '100%' }} />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          addItem({
            id: Date.now().toString(),
            group: 'group1',
            content: 'New Event',
            start: new Date().toISOString(),
          })
        }
        style={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        Add Event
      </Button>
    </div>
  );
};

export default VisTimeline;
