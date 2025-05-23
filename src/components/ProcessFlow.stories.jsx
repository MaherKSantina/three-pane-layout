import { StoreContext } from '../contexts/StoreContext';
import { useLocalFlowStore } from '../stores/flow.local';
import ProcessFlow from './ProcessFlow';

const meta = {
  title: "Visualization/ProcessFlow/Main",
  component: ProcessFlow,
};

export default meta;

export const Default = {
  render() {
    return (<StoreContext.Provider value={useLocalFlowStore("flow-diagram")()}>
      <ProcessFlow
          direction="LR"
        />
    </StoreContext.Provider>)
  }
};