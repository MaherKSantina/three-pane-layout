import DataPartCreateDialog from './DataPartCreateDialog';

const meta = {
  component: DataPartCreateDialog,
};

export default meta;

export const Default = {
  render() {
    return <DataPartCreateDialog open={true}></DataPartCreateDialog>
  }
};

export const DataFilled = {
  render() {
    return <DataPartCreateDialog initialValues={{
      type: "string",
      key: "example_key",
      value: "example_value",
      parent_id: null
    }}  open={true}></DataPartCreateDialog>
  }
};