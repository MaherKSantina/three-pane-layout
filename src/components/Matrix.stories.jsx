import Matrix from './Matrix';

const meta = {
  component: Matrix,
};

export default meta;

export const Default = {
  render() {
    return <Matrix matrix={[
    [{value: "-"}, {value: "O"}],
    [{value: "O"}]
  ]}></Matrix>
  }
};