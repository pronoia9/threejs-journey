import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create(
  subscribeWithSelector((set) => {
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
  })
);
