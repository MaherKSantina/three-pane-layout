import { buildGraph } from '../stores/networkJSONStore.local';
import NetworkGraphEditor from './NetworkGraphEditor';

const meta = {
  component: NetworkGraphEditor,
};

export default meta;

export const JSON = {
  render() {
    const { nodes: initialNodes, edges: initialEdges } = buildGraph({hello: "world"})
    return <NetworkGraphEditor initialNodes={initialNodes} initialEdges={initialEdges} allowsChildrenAndLabel={false}></NetworkGraphEditor>
  }
};

export const Process = {
  render() {
    return <NetworkGraphEditor ></NetworkGraphEditor>
  }
};