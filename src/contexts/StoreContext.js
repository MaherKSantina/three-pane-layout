// src/contexts/GanttStoreContext.js
import { createContext, useContext } from "react";

export const StoreContext = createContext(null);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store not provided");
  return store;
};


export const ChatContext = createContext(null)
export const useChatStore = () => {
  const store = useContext(ChatContext);
  if (!store) throw new Error("Store not provided");
  return store;
};

export const KanbanContext = createContext(null)
export const useKanbanStore = () => {
  const store = useContext(KanbanContext);
  if (!store) throw new Error("Store not provided");
  return store;
};

export const GanttContext = createContext(null)
export const useGanttStore = () => {
  const store = useContext(KanbanContext);
  if (!store) throw new Error("Store not provided");
  return store;
};

export const TimelineContext = createContext(null)
export const useTimelineStore = () => {
  const store = useContext(TimelineContext);
  if (!store) throw new Error("Store not provided");
  return store;
};

export const CalendarContext = createContext(null)
export const useCalendarStore = () => {
  const store = useContext(CalendarContext);
  if (!store) throw new Error("Store not provided");
  return store;
};

export const ProcessContext = createContext(null)
export const useProcessStore = () => {
  const store = useContext(ProcessContext);
  if (!store) throw new Error("Store not provided");
  return store;
};