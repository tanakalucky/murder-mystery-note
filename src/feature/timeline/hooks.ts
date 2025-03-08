import { Note, useNotesStore } from '@/store/note-store';

export const useGroupedByDateNotes = (): Record<string, Note[]> => {
  const { notes } = useNotesStore();

  const groupedByDate = notes.reduce<Record<string, Note[]>>((acc, note) => {
    const dateKey = note.date || '日付不明';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(note);
    return acc;
  }, {});

  return groupedByDate;
};
