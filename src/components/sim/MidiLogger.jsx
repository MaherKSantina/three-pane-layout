// MidiLogger.jsx
import React, { useEffect } from "react";

export default function MidiLogger({onChange}) {
  const connect = async () => {
    if (!("requestMIDIAccess" in navigator)) {
      console.log("Web MIDI not supported");
      return;
    }

    const access = await navigator.requestMIDIAccess();
    access.inputs.forEach(input => {
      input.onmidimessage = (e) => {
        const [status, data1, data2] = e.data;
        if(status === 248) return; // ignore clock messages
        onChange({status, data1, data2})
      };
    });

    console.log("MIDI ready. Twist a knob or press a key!");
  };

  useEffect(() => {
    connect();
  }, [])

  return (
    <button onClick={connect}>Connect MIDI</button>
  );
}
