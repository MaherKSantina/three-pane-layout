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

export const Requests = {
  render() {
    return <MatrixListWithDetails identifier="requestsMatrices"></MatrixListWithDetails>
  }
};