import { FigmaPagesOption } from '../components/FigmaPagesOption';

const meta = {
  title: "Figma/PagesOption",
  component: FigmaPagesOption,
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    pages: ["Page 1", "Page 2", "Page 3"],
    selected: "Page 1"
  }
};