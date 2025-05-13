import { create } from 'zustand';
import { env } from '../constants/env';

export const useAgentsStore = create((set, get) => ({
  agents: {},  
}));
