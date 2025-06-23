import CalendarWithTasksList from './CalendarWithTasksList';

const meta = {
  component: CalendarWithTasksList,
};

export default meta;

export const Default = {
  render() {
    return <CalendarWithTasksList itemID={11}></CalendarWithTasksList>
  }
};