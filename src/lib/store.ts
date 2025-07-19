import { create } from 'zustand';
import { Cut } from './types';

interface State {
  cuts: Cut[];
  shareUrl: string;
  videoId: string | null;
  setCuts: (cuts: Cut[]) => void;
  addCut: (cut: Cut) => void;
  removeCut: (index: number) => void;
  clearCuts: () => void;
  setShareUrl: (url: string) => void;
  setVideoId: (id: string | null) => void;
}

export const useStore = create<State>((set) => ({
  cuts: [],
  shareUrl: '',
  videoId: null,
  setCuts: (cuts) => set({ cuts }),
  addCut: (cut) => set((state) => ({ cuts: [...state.cuts, cut] })),
  removeCut: (index) =>
    set((state) => ({ cuts: state.cuts.filter((_, i) => i !== index) })),
  clearCuts: () => set({ cuts: [] }),
  setShareUrl: (url) => set({ shareUrl: url }),
  setVideoId: (id) => set({ videoId: id }),
}));
