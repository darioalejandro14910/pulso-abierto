import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CryptoId } from '../types/crypto';

interface FavoritesState {
  favoriteIds: CryptoId[];
  toggleFavorite: (id: CryptoId) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favId) => favId !== id)
            : [...state.favoriteIds, id]
        }))
    }),
    {
      name: 'pulso-abierto-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds })
    }
  )
);