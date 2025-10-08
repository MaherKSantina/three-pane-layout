// File: views/DataPartBoard.stories.jsx
import React from "react";
import DataPartBoard from "./DataPartBoard";

const meta = {
  component: DataPartBoard,
};
export default meta;

export const Default = {
  render() {
    const dummy = [
      {
        id: 1001,
        agent_name: "Assistant Alpha",
        data: [
          { id: 2001, type: "string",  key: "greeting", value: "hello", parent_id: 1001 },
          { id: 2002, type: "number",  key: "retries",  value: "3",     parent_id: 1001 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
      {
        id: 1002,
        agent_name: "Bot Bravo",
        data: [
          { id: 2003, type: "boolean", key: "enabled",  value: "true",  parent_id: 1002 },
        ],
      },
    ];

    return (
      <DataPartBoard
          items={dummy}
          onRequestAddMain={(d, p) => console.log("open AddMainPartDialog", d, p)}
          onRequestAddChild={(d, p) => console.log("open AddSubPartDialog for parent:", d, p)}
          onDeleteDataPart={(childId) => console.log("delete child id:", childId)}
        />
    );
  },
};
