import { create } from 'zustand';

export interface Place {
  id: number;
  name: string;
  color: string;
}

interface PlaceState {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  getPlaceColor: (placeName: string) => string;
}

export const usePlaceStore = create<PlaceState>((set, get) => ({
  places: [],
  setPlaces: (places: Place[]) => {
    set({ places });
  },
  getPlaceColor: (placeName: string) => {
    const { places } = get();
    const place = places.find((p) => p.name === placeName);
    return place ? place.color : '#000000';
  },
}));
