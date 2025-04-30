import { Button } from '@mui/material';
import { FigmaTitleWithAccessory } from '../components/FigmaTitleWithAccessory';
import { ZoomIn } from '@mui/icons-material';

const meta = {
  title: "Figma/TitleWithAccessory",
  component: FigmaTitleWithAccessory,
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: "Test",
    action: (<ZoomIn></ZoomIn>)
  }
};