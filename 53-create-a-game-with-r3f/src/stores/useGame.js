import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create(
  subscribeWithSelector((set) => {
    return {
      // Blocks/Levels
      blocksCount: 3,
      blocksSeed: 0,
      // Phases
      phase: 'ready',
      start: () => {
        set((state) => {
          return state.phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {};
        });
      },
      end: () => {
        set((state) => {
          return state.phase === 'playing' ? { phase: 'ended', endTime: Date.now() } : {};
        });
      },
      restart: () => {
        set((state) => {
          return state.phase !== 'ready' ? { phase: 'ready', startTime: 0, endTime: 0 } : {};
        });
      },
      // Time
      startTime: 0,
      endTime: 0,
    };
  })
);
