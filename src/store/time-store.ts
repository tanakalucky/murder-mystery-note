import { create } from 'zustand';

interface TimeState {
  times: string[];
  setTimes: (times: string[]) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  times: [],
  setTimes: (times: string[]) => {
    const sortedTimes = [...times].sort();
    set({ times: sortedTimes });
  },
}));
