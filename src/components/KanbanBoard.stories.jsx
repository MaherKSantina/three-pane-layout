import { TextField } from '@mui/material';
import { StoreContext } from '../contexts/StoreContext';
import { useLocalKanbanStore } from '../stores/kanban.local';
import KanbanBoard from './KanbanBoard';
import { useApiKanbanStore } from '../stores/kanban.api';

const meta = {
  title: "Visualization/Kanban/Main",
  component: KanbanBoard,
};

export default meta;

export const LocalFull = {
  render() {
    return (
<StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <KanbanBoard mode={'full'}></KanbanBoard>
    </StoreContext.Provider>
    )
  }
};

export const LocalFixed = {
  render() {
    return (
<StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <KanbanBoard mode={'fixed'}></KanbanBoard>
    </StoreContext.Provider>
    )
  }
};

export const Embedded = {
  render() {
    return (
      <div>
        <StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <KanbanBoard></KanbanBoard>
    </StoreContext.Provider>
      </div>
    )
  }
};

export const API = {
  render() {
    return (
<StoreContext.Provider value={useApiKanbanStore()}>
      <KanbanBoard></KanbanBoard>
    </StoreContext.Provider>
    )
  }
};