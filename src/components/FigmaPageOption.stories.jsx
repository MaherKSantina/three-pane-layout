import { fn } from '@storybook/test';
import { FigmaPageOption } from './FigmaPageOption';

const meta = {
  title: "Figma/PageOption",
  component: FigmaPageOption,
};

export default meta;

export const Default = {
  argTypes: {
    title: {
      type: "string"
    }
  },
  args: {
    isSelected: false,
    title: "Page 1",
    onClick: fn()
  }
};

export const Selected = {
  args: {
    isSelected: true,
    title: "Page 1",
    onClick: fn()
  },
  argTypes: {
    title: {
      type: "string"
    }
  },
};