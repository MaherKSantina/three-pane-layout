import { PersonAdd } from '@mui/icons-material';
import IconMenu from './IconMenu';
import Avatar from '@mui/material/Avatar';

const meta = {
  component: IconMenu,
};

export default meta;

export const Default = {
  args: {
    icon: (<Avatar sx={{ width: 32, height: 32 }}>M</Avatar>),
    items: [
      "Menu Item 1",
      "Menu Item 2"
    ],

  }
};

export const Text = {
  args: {
    icon: "Text",
    items: [
      "Menu Item 1",
      "Menu Item 2"
    ],

  }
};

export const Composite = {
  args: {
    icon: (<>
    Text
    <PersonAdd></PersonAdd>
    </>),
    items: [
      "Menu Item 1",
      "Menu Item 2"
    ],

  }
};