import { create } from 'zustand';

export interface Character {
  id: number;
  name: string;
  color: string;
}

interface CharacterState {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  getCharacterColor: (charName: string) => string;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  setCharacters: (characters: Character[]) => {
    set({ characters });
  },
  getCharacterColor: (charName: string) => {
    const { characters } = get();
    const character = characters.find((char) => char.name === charName);
    return character ? character.color : '#000000';
  },
}));
