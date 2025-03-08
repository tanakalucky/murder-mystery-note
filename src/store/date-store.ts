import { create } from 'zustand';

interface DateState {
  dates: string[];
  setDates: (dates: string[]) => void;
}

export const useDateStore = create<DateState>((set) => ({
  dates: [],
  setDates: (dates: string[]) => set({ dates }),
}));
