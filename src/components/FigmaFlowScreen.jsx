import { Handle } from '@xyflow/react';
import PropTypes from 'prop-types';

function FigmaFlowScreen({ label, selected }) {
  return (
    <div
      style={{
        width: 320,
        height: 667,
        padding: 16,
        borderRadius: 8,
        backgroundColor: selected ? '#EEF2F6' : '#FFFFFF',
        border: '1px solid #ccc',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        textAlign: 'center',
        alignContent: "center",
        boxSizing: 'border-box',     // ✅ Important to include padding inside width
        position: 'relative',         // ✅ Handles need relative parent
      }}
    >
      {/* Incoming handle */}
      <Handle
        type="target"
        position='left'
        style={{ background: '#555' }}
      />

      {/* Label */}
      <div>
        {label}
      </div>

      {/* Outgoing handle */}
      <Handle
        type="source"
        position="right"
        style={{ background: '#555' }}
      />
    </div>
  );
}

FigmaFlowScreen.propTypes = {
    /** The name of the screen */
    label: PropTypes.string,
    /** Is this screen selected? */
    selected: PropTypes.bool,
};

export default FigmaFlowScreen;
