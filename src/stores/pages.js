import { create } from 'zustand';
import { env } from '../constants/env';

export const usePagesStore = create((set, get) => ({
  pages: {},

  toggleSelect: (id) => {
    const comp = get().pages[id];
    set((state) => ({
        pages: {
        ...state.pages,
        [id]: {
          ...comp,
          selected: !comp.selected,
        },
      },
    }));
  },

  getPages: () => {
    const pages = get().pages
    return Object.values(pages)
  },

  getSelectedPage: () => {
    const pages = get().pages;
    return Object.values(pages).find(c => c.selected)?.title;
  },

  setSelected: (title) => {
    set((state) => {
      const pages = { ...state.pages };
  
      // Find the page with the matching title
      const match = Object.values(pages).find((page) => page.title === title);
      const selectedId = match?.key;
  
      // Update selection state
      for (const id of Object.keys(pages)) {
        pages[id] = {
          ...pages[id],
          selected: id === selectedId,
        };
      }
  
      return { pages };
    });
  },  

  saveCode: (id, code) => {
    const page = get().pages[id];
    set((state) => ({
        pages: {
        ...state.pages,
        [id]: {
          ...page,
          code,
        },
      },
    }));
  },
  fetchPages: async (selectedPage) => {
    try {
      const response = await fetch('https://n8n-proud-leaf-4689.fly.dev/webhook/pages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Expected an array of pages');
        return;
      }

      const pages = {};
      for (const page of data) {
        if (!page.key) {
          console.warn('Skipping page without key:', page);
          continue;
        }
        pages[page.key] = page;
        if(selectedPage) {
            pages[selectedPage.key].selected = true
        }
      }

      set({ pages });
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  },
  syncCodeToServer: async (key, code) => {
    const pages = get().pages;
    let selectedPage = Object.values(pages).find(c => c.selected);
  
    try {
      const response = await fetch(`${env.httpHost}/page/${key}/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
  
      if (!response.ok) {
        const errBody = await response.json();
        throw new Error(errBody.message || 'Unknown error saving code');
      }
  
      console.log(`Successfully synced code for page: ${key}`);
      await get().fetchPages(selectedPage);
      return null; // No error
    } catch (error) {
      console.error('Error syncing code to server:', error);
      return error.message;
    }
  }  
}));
