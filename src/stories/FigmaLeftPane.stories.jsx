import { FigmaLeftPane } from '../components/FigmaLeftPane';

const meta = {
  title: "Figma/DemoLeftPane",
  component: () => (<FigmaLeftPane pages={["Page 1", "Page 2", "Page 3"]} selected={"Page 1"}></FigmaLeftPane>),
};

export default meta;

export const Default = {};