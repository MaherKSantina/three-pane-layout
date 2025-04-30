import { fn } from '@storybook/test';
import { FigmaPageOption } from '../components/FigmaPageOption';

const meta = {
  title: "Figma/PageOption",
  component: FigmaPageOption,
  // tags: ['autodocs'],
};

export default meta;

export const Normal = {
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
};