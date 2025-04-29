import { FigmaLeftPane } from './FigmaLeftPane';

const meta = {
  title: "Figma/LeftPane",
  component: () => (<FigmaLeftPane pages={["Page 1", "Page 2", "Page 3"]} selected={"Page 1"}></FigmaLeftPane>),
};

export default meta;

export const Default = {};