import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_THEME, type Theme } from '@utils/theme';

interface StoreState {
  theme: Theme;
  updateTheme: (newTheme: Theme) => void;
}

export const useStore = create<StoreState>()(
  persist(
    // by default, 'localStorage' is used
    (set) => ({
      theme: DEFAULT_THEME,
      updateTheme: (newTheme) => set({ theme: newTheme }),
    }),
    {
      name: 'persistent-store', // name of the item in the storage (must be unique),
      skipHydration: true, // prevent hydration errors by hydrating after component mount (useEffect)
    },
  ),
);
