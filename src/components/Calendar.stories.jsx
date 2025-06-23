import { StoreContext } from '../contexts/StoreContext';
import { useCalendarApiStore } from '../stores/calendar.api';
import { useCalendarLocalStore } from '../stores/calendar.local';
import Calendar from './Calendar';
import GanttChart from './GanttChart';

const meta = {
  title: "Visualization/Calendar/Main",
  component: Calendar,
};

export default meta;

export const Default = {
  render() {
    return (
      <StoreContext.Provider value={useCalendarLocalStore()}>
      <Calendar></Calendar>
    </StoreContext.Provider>
    )
  }
};

export const API = {
  render() {
    return (
      <Calendar itemID={11}></Calendar>
    )
  }
};