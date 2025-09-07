import { create } from 'zustand';

interface RedBallState {
  x: number,
  y: number,
  setPosition: (position: { x: number, y: number }) => void;
}

export const useRedBallStore = create<RedBallState>((set) => ({
  x: 50,
  y: 50,
  setPosition: (position: { x: number, y: number }) => set(() => ({ x: position.x, y: position.y })),
}));