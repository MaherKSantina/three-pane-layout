import { StoreContext, TimelineContext } from '../contexts/StoreContext';
import { useLocalTimelineStore } from '../stores/timeline.local';
import VisTimeline from './VisTimeline';

const meta = {
  component: VisTimeline,
};

export default meta;

export const Default = {
  render() {
    return (
      <TimelineContext.Provider value={useLocalTimelineStore("Timeline/Local")()}>
        <VisTimeline width={"100%"} height={"100vh"}></VisTimeline>
      </TimelineContext.Provider>
    )
  }
};