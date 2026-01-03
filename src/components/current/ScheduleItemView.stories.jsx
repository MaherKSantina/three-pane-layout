import { ScheduleItemView } from './ScheduleItemView';

const meta = {
  component: ScheduleItemView,
};

export default meta;

export const Default = {
  render() {
    return <ScheduleItemView color={"red"} symbol={"S"} isStrikedOut={true} statusChipText={"Status"} deadlineChipText={"Deadline"} title={"Title"}></ScheduleItemView>
  }
};