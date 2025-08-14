import { create } from 'zustand';
import { Cut, Loop } from './types';

interface State {
  cuts: Cut[];
  loops: Loop[];
  shareUrl: string;
  videoId: string | null;
  searchTerm: string;
  sortOrder: 'newest' | 'oldest';
  dialogDeleteOpen: boolean;
  dialogEditOpen: boolean;
  dialogSaveOpen: boolean;
  selectedLoop: Loop | null;
  setCuts: (cuts: Cut[]) => void;
  setLoops: (update: Loop[] | ((prev: Loop[]) => Loop[])) => void
  addCut: (cut: Cut) => void;
  removeCut: (index: number) => void;
  clearCuts: () => void;
  setShareUrl: (url: string) => void;
  setVideoId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortOrder: (order: 'newest' | 'oldest') => void;
  setDialogDeleteOpen: (open: boolean) => void;
  setDialogEditOpen: (open: boolean) => void;
  setDialogSaveOpen: (open: boolean) => void;
  setSelectedLoop: (loop: Loop | null) => void;
}

export const useStore = create<State>((set) => ({
  cuts: [],
  loops: [],
  shareUrl: '',
  videoId: null,
  searchTerm: '',
  sortOrder: 'newest',
  dialogDeleteOpen: false,
  dialogEditOpen: false,
  dialogSaveOpen: false,
  selectedLoop: null,
  setCuts: (cuts) => set({ cuts }),
  setLoops: (update: Loop[] | ((prev: Loop[]) => Loop[])) =>
  set((state) => ({
    loops: typeof update === 'function' ? update(state.loops) : update,
  })),

  addCut: (cut) => set((state) => ({ cuts: [...state.cuts, cut] })),
  removeCut: (index) =>
    set((state) => ({ cuts: state.cuts.filter((_, i) => i !== index) })),
  clearCuts: () => set({ cuts: [] }),
  setShareUrl: (url) => set({ shareUrl: url }),
  setVideoId: (id) => set({ videoId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setDialogDeleteOpen: (open) => set({ dialogDeleteOpen: open }),
  setDialogEditOpen: (open) => set({ dialogEditOpen: open }),
  setDialogSaveOpen: (open) => set({ dialogSaveOpen: open }),
  setSelectedLoop: (loop) => set({ selectedLoop: loop }),
}));
