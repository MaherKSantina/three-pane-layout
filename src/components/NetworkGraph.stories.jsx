import { TextField } from '@mui/material';
import NetworkGraph from './NetworkGraph';
import SplitPane from './SplitPane3';
import NodeSettings from './NodeSettings';
import { buildGraph, useJsonStore } from '../stores/networkJSONStore.local';
import { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';

const meta = {
  component: NetworkGraph,
};

export default meta;

export const Default = {
  render() {
    return <NetworkGraph data={{}} height={"100vh"} width={"100vw"}></NetworkGraph>
  }
};