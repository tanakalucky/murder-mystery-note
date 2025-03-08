import { useNotesStore } from '@/store/note-store';
import { useTimeStore } from '@/store/time-store';
import { useState } from 'react';

type UseTimeTag = {
  editingTagId: number | null;
  editTagText: string;
  setEditingTagId: (id: number | null) => void;
  setEditTagText: (text: string) => void;
  startEditingTag: (id: number, text: string) => void;
  saveTag: () => void;
  deleteTag: (id: number) => void;
};

export const useTimeTag = (): UseTimeTag => {
  const { notes, setNotes } = useNotesStore();
  const { times, setTimes } = useTimeStore();
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editTagText, setEditTagText] = useState('');

  const startEditingTag = (id: number, text: string) => {
    setEditingTagId(id);
    setEditTagText(text);
  };

  const saveTag = () => {
    if (editingTagId === null || editTagText.trim() === '') return;

    const oldName = times[editingTagId];

    // 時間情報を更新
    setTimes(times.map((time, index) => (index === editingTagId ? editTagText : time)));

    // 関連するメモも更新
    if (oldName) {
      setNotes(notes.map((note) => (note.time === oldName ? { ...note, time: editTagText } : note)));
    }

    setEditingTagId(null);
    setEditTagText('');
  };

  const deleteTag = (id: number) => {
    const timeValue = times[id];

    setTimes(times.filter((_, index) => index !== id));

    setNotes(
      notes.map((note) => {
        if (note.time === timeValue) {
          return { ...note, time: null };
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
