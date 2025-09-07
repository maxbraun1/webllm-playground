import { MLCEngine } from '@mlc-ai/web-llm';
import { create } from 'zustand';
import { InitProgressCallbackData } from '../lib/types';

interface EngineState {
  engine: null | MLCEngine;
  setEngine: (engine: MLCEngine) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  progressData: null | InitProgressCallbackData;
  setProgressData: (progressData: InitProgressCallbackData) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  engine: null,
  setEngine: (engine: MLCEngine) => set(() => ({ engine })),
  loading: true,
  setLoading: (loading: boolean) => set(() => ({ loading })),
  progressData: null,
  setProgressData: (progressData: InitProgressCallbackData) => set(() => ({ progressData })),
}));