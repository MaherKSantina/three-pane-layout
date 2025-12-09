import MarkdownView from './MarkdownView';

const meta = {
  component: MarkdownView,
};

export default meta;

export const Default = {
  render() {
    return <MarkdownView text={"# Hello World"}></MarkdownView>
  }
};