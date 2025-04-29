import { Button } from '@mui/material';
import { FigmaSection } from './FigmaSection';
import { XCodeLayout } from './XCodeLayout';

const meta = {
  component: FigmaSection,
};

export default meta;

export const Default = {
  args: {
    title: "Title",
    action: (<Button>Action</Button>),
    details: (<XCodeLayout></XCodeLayout>)
  }
};