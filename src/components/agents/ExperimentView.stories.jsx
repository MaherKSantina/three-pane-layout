import ExperimentView from './ExperimentView';

const meta = {
  component: ExperimentView,
};

export default meta;

export const Default = {
  render() {
    return <ExperimentView parentId={4}></ExperimentView>
  }
};