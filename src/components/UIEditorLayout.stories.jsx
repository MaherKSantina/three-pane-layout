import { UIEditorLayout } from './UIEditorLayout';

const meta = {
  title: "Full/UIEditor",
  component: () => <UIEditorLayout height='800px' pages={["Page 1", "Page 2", "Page 3"]} selected={"Page 2"} code={"Code for Page 2"}></UIEditorLayout>,
};

export default meta;

export const Default = {};