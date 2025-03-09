import { TagType } from '@/feature/tag-manager/types';
import { create } from 'zustand';

export interface Note {
  id: number;
  content: string;
  character: string | null;
  place: string | null;
  time: string | null;
  date: string | null;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (content: string) => void;
  deleteNote: (noteId: number) => void;
  addTagToNote: (noteId: number, tagType: TagType, tagValue: string) => void;
  removeTagFromNote: (noteId: number, tagType: TagType) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes: Note[]) => {
    set({ notes });
  },
  addNote: (content: string) => {
    if (content.trim() === '') return;

    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: Date.now(),
          content,
          character: null,
          place: null,
          time: null,
          date: null,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },
  deleteNote: (noteId: number) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
    }));
  },
  addTagToNote: (noteId: number, tagType: TagType, tagValue: string) => {
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            [tagType]: tagValue,
          };
        }
        return note;
      }),
    }));
  },
  removeTagFromNote: (noteId: number, tagType: TagType) => {
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === noteId) {
          const updatedNote = { ...note };
          updatedNote[tagType] = null;
          return updatedNote;
        }
        return note;
      }),
    }));
  },
}));
