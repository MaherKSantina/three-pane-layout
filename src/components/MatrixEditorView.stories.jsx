import { MatrixEditorView } from './MatrixEditorView';

const meta = {
  component: MatrixEditorView,
};

export default meta;

export const Default = {
  render() {
    return <MatrixEditorView matrixId={2}></MatrixEditorView>
  }
};