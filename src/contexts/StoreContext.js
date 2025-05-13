// src/contexts/GanttStoreContext.js
import { createContext, useContext } from "react";

export const StoreContext = createContext(null);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store not provided");
  return store;
};
