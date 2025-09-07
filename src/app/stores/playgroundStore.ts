import { create } from 'zustand';

interface PlaygroundState {
  width: number,
  height: number,
  setSize: (size: { width: number, height: number }) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  width: 0,
  height: 0,
  setSize: (size: { width: number, height: number }) => set(() => ({ width: size.width, height: size.height })),
}));