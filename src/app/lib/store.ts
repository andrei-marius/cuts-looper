import { create } from 'zustand';
import { Cut, Loop } from './types';

interface State {
  cuts: Cut[];
  shareUrl: string;
  searchTerm: string;
  sortOrder: 'newest' | 'oldest';
  dialogDeleteOpen: boolean;
  dialogEditOpen: boolean;
  selectedLoop: Loop | null;
  isAuthenticated: boolean | null;
  setCuts: (cuts: Cut[]) => void;
  addCut: (cut: Cut) => void;
  removeCut: (index: number) => void;
  clearCuts: () => void;
  setShareUrl: (url: string) => void;
  setSearchTerm: (term: string) => void;
  setSortOrder: (order: 'newest' | 'oldest') => void;
  setDialogDeleteOpen: (open: boolean) => void;
  setDialogEditOpen: (open: boolean) => void;
  setSelectedLoop: (loop: Loop | null) => void;
  setAuth: (auth: boolean | null) => void;
}

export const useStore = create<State>((set) => ({
  cuts: [],
  shareUrl: '',
  searchTerm: '',
  sortOrder: 'newest',
  dialogDeleteOpen: false,
  dialogEditOpen: false,
  selectedLoop: null,
  isAuthenticated: null,
  setCuts: (cuts) => set({ cuts }),
  addCut: (cut) => set((state) => ({ cuts: [...state.cuts, cut] })),
  removeCut: (index) =>
    set((state) => ({ cuts: state.cuts.filter((_, i) => i !== index) })),
  clearCuts: () => set({ cuts: [] }),
  setShareUrl: (url) => set({ shareUrl: url }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setDialogDeleteOpen: (open) => set({ dialogDeleteOpen: open }),
  setDialogEditOpen: (open) => set({ dialogEditOpen: open }),
  setSelectedLoop: (loop) => set({ selectedLoop: loop }),
  setAuth: (auth) => set({ isAuthenticated: auth }),
}));
