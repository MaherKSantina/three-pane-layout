import { ScheduleItemView } from './ScheduleItemView';
import { ScheduleList } from './ScheduleList';

const meta = {
  component: ScheduleList,
};

export default meta;

export const Default = {
  render() {
    const items = [
  {
    "name": "Amani's 21st Bday",
    "date": "16-01-2026T19:00"
  },
  {
    "name": "Olivia Work",
    "description": "Research about bonding",
    "date": "06-01-2026T16:00",
    "duration": 3
  },
  {
    "name": "Change Layana's 3yr checkup booking",
    "args": {
      "current": "08-01-2026T09:30",
      "duration": 1
    },
    "children": [
      {
        "name": "Research new date"
      }
    ],
    "deadlineDate": "06-01-2026"
  },
  {
    "name": "Cancel Stretchlab subscription",
    "deadlineDate": "01-01-2026",
    "status": "done"
  },
  {
    "name": "Book Arabic classes for Mirana with Mona",
    "date": "12-01-2026T11:00",
    "children": [
      {
        "name": "Decide on times",
        "deadlineDate": "TBC"
      }
    ]
  },
  {
    "name": "Felix's Birthday",
    "date": "17-01-2026T10:00",
    "duration": 3
  },
  {
    "name": "Car DIY and Knowledge",
    "date": "18:01-2026T08:00",
    "children": [
      {
        "name": "Research something to do",
        "deadlineDate": "TBC"
      }
    ]
  },
  {
    "name": "Bulli beach with H&H",
    "date": "24-01-2026",
    "children": [
      {
        "name": "Research prerequisites",
        "deadlineDate": "today"
      }
    ]
  },
  {
    "name": "Assignment 2 Due",
    "date": "06-02-2026",
    "children": [
      {
        "name": "Research prerequisites",
        "deadlineDate": "today"
      }
    ]
  },
  {
    "name": "Layana's Birthday",
    "children": [
      {
        "name": "Research Date",
        "deadlineDate": "today"
      },
      {
        "name": "Research Prerequisites",
        "deadlineDate": "today"
      }
    ]
  },
  {
    "name": "Gyno Appt",
    "date": "26-03-2026T15:00",
    "monitorClash": true
  }
]

    return <ScheduleList items={items} groupRules={[
      {
        title: "Urgent",
        include: (item) => {
          return item.deadlineDate === "today"
        }
      },
      {
        title: "Tasks",
        include: (item, ancestors) => {
          return item.deadlineDate !== "today" && ancestors.length !== 0
        }
      },
      {
        title: "Projects",
        include: (item, ancestors) => {
          return item.deadlineDate !== "today" && ancestors.length === 0
        }
      }
    ]} renderItem={(item, ancestors) => {
      return <ScheduleItemView color={"red"} symbol={"U"} isStrikedOut={item.status === "done"} statusChipText={item.status} deadlineChipText={item.deadlineDate} title={item.name} subtitle={ancestors.map(x => x.name).join(" > ")}></ScheduleItemView>
    }} />;
  }
};