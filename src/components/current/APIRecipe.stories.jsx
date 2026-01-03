import ApiRecipe from './APIRecipe';

const meta = {
  component: ApiRecipe,
};

export default meta;

export const Default = {
  render() {
    return <ApiRecipe file="chicken-fajitas" />;
  }
};