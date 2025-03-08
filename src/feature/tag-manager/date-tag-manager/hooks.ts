import { useDateStore } from '@/store/date-store';
import { useNotesStore } from '@/store/note-store';
import { useState } from 'react';

type UseDateTag = {
  editingTagId: number | null;
  editTagText: string;
  setEditingTagId: (id: number | null) => void;
  setEditTagText: (text: string) => void;
  startEditingTag: (id: number, text: string) => void;
  saveTag: () => void;
  deleteTag: (id: number) => void;
};

export const useDateTag = (): UseDateTag => {
  const { notes, setNotes } = useNotesStore();
  const { dates, setDates } = useDateStore();
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editTagText, setEditTagText] = useState('');

  const startEditingTag = (id: number, text: string) => {
    setEditingTagId(id);
    setEditTagText(text);
  };

  const saveTag = () => {
    if (editingTagId === null || editTagText.trim() === '') return;

    const oldName = dates[editingTagId];

    // 日付情報を更新
    setDates(dates.map((date, index) => (index === editingTagId ? editTagText : date)));

    // 関連するメモも更新
    if (oldName) {
      setNotes(notes.map((note) => (note.date === oldName ? { ...note, date: editTagText } : note)));
    }

    setEditingTagId(null);
    setEditTagText('');
  };

  const deleteTag = (id: number) => {
    const dateValue = dates[id];

    setDates(dates.filter((_, index) => index !== id));

    setNotes(
      notes.map((note) => {
        if (note.date === dateValue) {
          return { ...note, date: null };
        }
        return note;
      }),
    );
  };

  return {
    editingTagId,
    editTagText,
    setEditingTagId,
    setEditTagText,
    startEditingTag,
    saveTag,
    deleteTag,
  };
};
