import { useEffect, useState } from "react";
import { ScheduleList } from "./ScheduleList";
import axios from "axios";
import { ScheduleItemView } from "./ScheduleItemView";

const { DateTime } = require('luxon');

function parseAnyDate(dateInput) {
    let modifiedDateInput = dateInput;
  if (dateInput instanceof Date) {
    return DateTime.fromJSDate(dateInput);
  }

  if (typeof dateInput === 'number') {
    return DateTime.fromMillis(dateInput);
  }

  if (typeof dateInput === 'string') {
    let dt = DateTime.fromISO(dateInput);
    if (dt.isValid) return dt;

    // Try other specific formats you expect
    dt = DateTime.fromFormat(dateInput, "dd-MM-yyyy");
    if (dt.isValid) return dt;

    modifiedDateInput = `${dateInput}:00`
    dt = DateTime.fromISO(modifiedDateInput);
    if (dt.isValid) return dt;
    
    return null
  }
  
  return null;
}

export default function APIScheduleList({file}) {
    const [items, setItems] = useState([])

    async function reloadData() {
        const response = await axios.get(`http://localhost:3000/events2/${file}`);
        setItems(response.data);
    }
    useEffect(() => {
        reloadData();
    }, []);
    function makeSort(a, b) {
        if (a.item.date && b.item.date) {
            // sort null dates to be first (DateTime luxon)
            let dateA = parseAnyDate(a.item.date);
            let dateB = parseAnyDate(b.item.date);
            if (!dateA) return -1;
            if (!dateB) return 1;
            return dateA.toMillis() - dateB.toMillis();
        } else if (a.item.date) {
            return -1;
        } else if (b.item.date) {
            return 1;
        } else {
            return 0;
        }   
    }

    let groupRules = [
        {
          title: "Monitor Clash",
          include: (item) => {
            return item.monitorClash && item.status !== "done"
          },
          sort: makeSort
        },
        {
          title: "Urgent",
          include: (item) => {
            return item.deadlineDate === "today" && item.status !== "done"
          },
          sort: makeSort
        },
        {
          title: "Tasks",
          include: (item, ancestors) => {
            return item.deadlineDate !== "today" && ancestors.length !== 0 && item.status !== "done"
          },
          sort: makeSort
        },
        {
          title: "Projects",
          include: (item, ancestors) => {
            return item.deadlineDate !== "today" && ancestors.length === 0 && item.status !== "done" && !item.monitorClash
          },
          sort: makeSort
        }
      ]
      function getGroup(item, ancestors) {
        for(let r of groupRules) {
            if(r.include(item, ancestors)) {
                return r;
            }
        }
    }
  return <ScheduleList items={items} groupRules={groupRules} renderItem={(item, ancestors) => {
        function makeChips() {
            const chips = [];
            if (item.monitorClash) {
                chips.push({
                    text: "Monitor Clash",
                    color: "red"
                });
            }
            return chips;
        }
        function makeSubtitle() {
            let dict = {}
            if(ancestors.length > 0) {
                dict["ancestors"] = ancestors.map(x => x.name).join(" > ");
            }
            if(item.date) {
                let parsed = parseAnyDate(item.date);
                if(parsed) {
                    dict["date"] = parsed.toFormat("ccc d LLL yyyy, h:mm a")
                } else {
                    dict["date"] = item.date
                }
            }
            if(item.deadlineDate) {
                let parsed = parseAnyDate(item.deadlineDate);
                if(parsed) {
                    dict["deadline"] = parsed.toFormat("ccc d LLL yyyy, h:mm a")
                } else {
                    dict["deadline"] = item.deadlineDate
                }
            }
            return Object.keys(dict).map(x => {
                return `${x}: ${dict[x]}`;
            }).join(" | ");
        }
        function makeSymbol() {
            let group = getGroup(item, ancestors);
            if(group.title === "Monitor Clash") {
                return null
            } else if (group.title === "Urgent") {
                return "U"
            } else if (group.title === "Tasks") {
                return "T"
            } else if (group.title === "Projects") {
                return "P"
            }
        }

        function makeColor() {
            let group = getGroup(item, ancestors);
            if(group.title === "Monitor Clash") {
                return "grey"
            } else if (group.title === "Urgent") {
                return "red"
            } else if (group.title === "Tasks") {
                return "blue"
            } else if (group.title === "Projects") {
                return "green"
            }
        }

        return <ScheduleItemView color={makeColor()} symbol={makeSymbol()} isStrikedOut={item.status === "done"} statusChipText={item.status} deadlineChipText={item.deadlineDate} title={item.name} subtitle={makeSubtitle()} chips={makeChips()}></ScheduleItemView>
      }} />;
}