// store.js
import { create } from 'zustand';

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  categories: [],
  setTransactions: (transactions) => set({ transactions }),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  updateCategoryRules: (categoryId, rules) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, rules } : cat
      ),
    })),
}));
