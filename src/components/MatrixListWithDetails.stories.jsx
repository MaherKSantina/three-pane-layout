import MatrixListWithDetails from './MatrixListWithDetails';

const meta = {
  component: MatrixListWithDetails,
};

export default meta;

export const Default = {
  render() {
    return <MatrixListWithDetails identifier="matrices"></MatrixListWithDetails>
  }
};

export const Agents = {
  render() {
    return <MatrixListWithDetails identifier="agentsMatrices"></MatrixListWithDetails>
  }
};