import { ReactFlowProvider } from "@xyflow/react";
import FigmaFlowScreen from "../components/FigmaFlowScreen";
import PropTypes from "prop-types";

const meta = {
  title: 'Figma/FlowScreen',
  component: FigmaFlowScreen,
  // tags: ['autodocs'],
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
    label: 'Login View',
    selected: false,
  },
};