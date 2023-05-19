import { create } from 'zustand';

export default create((set) => {
  return {
    blocksCount: 3,
    // Phases
    phase: 'ready',
    start: () => {
      set((state) => {
        return state.phase !== 'playing' ? { phase: 'playing' } : {};
      });
    },
    end: () => {
      set((state) => {
        return state.phase === 'playing' ? { phase: 'ended' } : {};
      });
    },
    restart: () => {
      set((state) => {
        return state.phase !== 'ready' ? { phase: 'ready' } : {};
      });
    },
  };
});
