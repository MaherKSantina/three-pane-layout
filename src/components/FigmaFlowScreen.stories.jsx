import { ReactFlowProvider } from "@xyflow/react";
import FigmaFlowScreen from "./FigmaFlowScreen";

const meta = {
  title: 'Figma/FlowScreen',
  component: FigmaFlowScreen,
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default = {
  args: {
    data: {
      label: 'Login View',
      selected: false,
    },
  },
};