import { Button } from '@mui/material';
import { FigmaTitleWithAccessory } from './FigmaTitleWithAccessory';
import { ZoomIn } from '@mui/icons-material';

const meta = {
  title: "Figma/TitleWithAccessory",
  component: ({title}) => {
   return(<FigmaTitleWithAccessory title={title} action={<ZoomIn>Test</ZoomIn>}></FigmaTitleWithAccessory>)
  },
};

export default meta;

export const Default = {
  args: {
    title: "Test"
  }
};