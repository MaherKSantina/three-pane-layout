import Calendar from "./Calendar";
import FullHeightCalendarTasksList from "./FullHeightCalendarTasksList";
import SplitPane from "./SplitPane3";


export default function CalendarWithTasksList({itemID}) {
    return <SplitPane initialSplit={0.2} 
    left={<FullHeightCalendarTasksList itemID={itemID}></FullHeightCalendarTasksList>} 
      right={<Calendar itemID={itemID}></Calendar>}></SplitPane>
}