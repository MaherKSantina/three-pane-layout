import { Button } from '@mui/material';
import { FigmaSection } from './FigmaSection';

const meta = {
  title: "Figma/Section",
  component: ({title, style}) => (<FigmaSection title={title} details={style}></FigmaSection>),
  argTypes: {
    style: {
      options: ['pages', 'layers'],
      control: { type: 'select' },
      mapping: {
        pages: <b>Bold</b>,
        layers: <i>Italic</i>,
      },
    }
  }
};

export default meta;

export const Default = {
  args: {
    title: "Title",
    style: "pages"
  }
};