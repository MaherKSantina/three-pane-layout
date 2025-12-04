import { GanttContext, StoreContext } from '../contexts/StoreContext';
import { createApiGanttStore } from '../stores/gantt.api';
import { useGanttLocalStore } from '../stores/gantt.local';
import GanttChart from './GanttChart';

const meta = {
  title: "Visualization/Gantt/Chart/Main",
  component: GanttChart,
};

export default meta;

export const Default = {
  render() {
    return (
      <GanttContext.Provider value={useGanttLocalStore()}>
      <GanttChart height={"100vh"} />
    </GanttContext.Provider>
    )
  }
};

// export const API = {
//   render() {
//     return (
//       <GanttContext.Provider value={useApiGanttStore()}>
//       <GanttChart height={"100vh"} />
//     </GanttContext.Provider>
//     )
//   }
// };

let data = {
    "tasks": [
        {
            "id": 1,
            "text": "Project kickoff",
            "start_date": "2025-01-05T22:00:00.000Z",
            "end_date": "2025-01-06T01:00:00.000Z",
            "parent": 0,
            "progress": 0
        },
        {
            "id": 2,
            "text": "Planning phase",
            "start_date": "2025-01-06T22:00:00.000Z",
            "end_date": "2025-01-09T06:00:00.000Z",
            "parent": 0,
            "progress": 0
        },
        {
            "id": 3,
            "text": "Design phase",
            "start_date": "2025-01-11T22:00:00.000Z",
            "end_date": "2025-01-16T06:00:00.000Z",
            "parent": 0,
            "progress": 0
        },
        {
            "id": 4,
            "text": "Execution phase",
            "start_date": "2025-01-19T22:00:00.000Z",
            "end_date": "2025-01-30T06:00:00.000Z",
            "parent": 0,
            "progress": 0
        },
        {
            "id": 5,
            "text": "Planning phase (detailed)",
            "start_date": "2025-01-06T22:00:00.000Z",
            "end_date": "2025-01-09T06:00:00.000Z",
            "parent": 0,
            "progress": 0
        },
        {
            "id": 6,
            "text": "Requirements workshop",
            "start_date": "2025-01-06T23:00:00.000Z",
            "end_date": "2025-01-07T05:00:00.000Z",
            "parent": 5,
            "progress": 0
        },
        {
            "id": 7,
            "text": "Scope definition",
            "start_date": "2025-01-07T22:00:00.000Z",
            "end_date": "2025-01-08T04:00:00.000Z",
            "parent": 5,
            "progress": 0
        },
        {
            "id": 8,
            "text": "Stakeholder sign-off",
            "start_date": "2025-01-08T22:00:00.000Z",
            "end_date": "2025-01-09T00:00:00.000Z",
            "parent": 5,
            "progress": 0
        }
    ],
    "links": [
        {
            "id": 1,
            "source": 2,
            "target": 3,
            "type": "0"
        },
        {
            "id": 2,
            "source": 2,
            "target": 4,
            "type": "0"
        },
        {
            "id": 3,
            "source": 1,
            "target": 2,
            "type": "0"
        },
        {
            "id": 4,
            "source": 6,
            "target": 7,
            "type": "0"
        }
    ]
}

export const Career = {
  render() {
    return (
      <GanttChart
      height={1000}
      tasks={data.tasks}
      links={data.links}
      expandedTaskIds={[1, 2, 5]} // open some groups by default
    />
    )
  }
};