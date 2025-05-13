import { StoreContext } from '../contexts/StoreContext';
import { useCalendarLocalStore } from '../stores/calendar.local';
import CalendarEventDialog from './CalendarEventDialog';

const meta = {
  title: "Visualization/Calendar/Dialog",
  component: CalendarEventDialog,
};

export default meta;

export const Default = {
  args: {
    dataString: `{"id":"1747101670105","title":"Maher","start":"2025-05-13T02:00:00.000Z","end":"2025-05-13T02:30:00.000Z","description":"Description"}`
  },
  render({dataString}) {
    let d = JSON.parse(dataString)
    d.start = new Date(d.start)
    d.end = new Date(d.end)
    return (
      <StoreContext.Provider value={useCalendarLocalStore()}>
      <CalendarEventDialog open={true} initialData={d} timeZone={"Australia/Sydney"}></CalendarEventDialog>
    </StoreContext.Provider>
    )
  }
};