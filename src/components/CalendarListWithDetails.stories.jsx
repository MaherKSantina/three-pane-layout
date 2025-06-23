import { useState } from 'react';
import Calendar from './Calendar';
import CalendarListWithDetails from './CalendarListWithDetails';
import SplitPane from './SplitPane3';
import FullHeightListWithAddDialog from './FullHeightListWithAddDialog';
import CalendarWithTasksList from './CalendarWithTasksList';

const meta = {
  component: CalendarListWithDetails,
};

export default meta;

function DefaultRender() {
  const [currentItem, setCurrentItem] = useState(null)

  return <SplitPane initialSplit={0.2} left={<FullHeightListWithAddDialog listKey={"processes"} onItemClick={(i) => {
      setCurrentItem(i)
  }}></FullHeightListWithAddDialog>} right={<CalendarWithTasksList itemID={currentItem?.id}></CalendarWithTasksList>}></SplitPane>
}

export const Default = {
  render() {
    return <DefaultRender></DefaultRender>
  }
};