import { create } from 'zustand';

interface TimelineState {
  expandedDates: Record<number, boolean>;
  expandedTimes: Record<string, boolean>;
  expandedPlaces: Record<string, boolean>;
  toggleDate: (dateIndex: number) => void;
  toggleTime: (dateIndex: number, timeIndex: number) => void;
  togglePlace: (dateIndex: number, timeIndex: number, placeIndex: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  expandedDates: {},
  expandedTimes: {},
  expandedPlaces: {},

  toggleDate: (dateIndex: number) =>
    set((state) => ({
      expandedDates: {
        ...state.expandedDates,
        [dateIndex]: state.expandedDates[dateIndex] === false ? true : false,
      },
    })),

  toggleTime: (dateIndex: number, timeIndex: number) =>
    set((state) => {
      const key = `${dateIndex}-${timeIndex}`;
      return {
        expandedTimes: {
          ...state.expandedTimes,
          [key]: state.expandedTimes[key] === false ? true : false,
        },
      };
    }),

  togglePlace: (dateIndex: number, timeIndex: number, placeIndex: number) =>
    set((state) => {
      const key = `${dateIndex}-${timeIndex}-${placeIndex}`;
      return {
        expandedPlaces: {
          ...state.expandedPlaces,
          [key]: state.expandedPlaces[key] === false ? true : false,
        },
      };
    }),
}));
