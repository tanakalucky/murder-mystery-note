import { create } from 'zustand';

interface DateState {
  dates: string[];
  setDates: (dates: string[]) => void;
}

export const useDateStore = create<DateState>((set) => ({
  dates: [],
  setDates: (dates: string[]) => {
    const sortedDates = [...dates].sort();
    set({ dates: sortedDates });
  },
}));
