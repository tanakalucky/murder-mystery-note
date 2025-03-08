import { useNotesStore } from '@/store/note-store';
import { usePlaceStore } from '@/store/place-store';
import { useState } from 'react';

type UsePlaceTag = {
  editingTagId: number | null;
  editTagText: string;
  editTagColor: string;
  setEditingTagId: (id: number | null) => void;
  setEditTagText: (text: string) => void;
  setEditTagColor: (color: string) => void;
  startEditingTag: (id: number, text: string, color: string) => void;
  saveTag: () => void;
  deleteTag: (id: number) => void;
};

export const usePlaceTag = (): UsePlaceTag => {
  const { notes, setNotes } = useNotesStore();
  const { places, setPlaces } = usePlaceStore();
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editTagText, setEditTagText] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  const startEditingTag = (id: number, text: string, color: string) => {
    setEditingTagId(id);
    setEditTagText(text);
    setEditTagColor(color);
  };

  const saveTag = () => {
    if (editingTagId === null || editTagText.trim() === '') return;

    const oldName = places.find((place) => place.id === editingTagId)?.name || '';

    // キャラクター情報を更新
    setPlaces(
      places.map((place) => (place.id === editingTagId ? { ...place, name: editTagText, color: editTagColor } : place)),
    );

    // 関連するメモも更新
    if (oldName) {
      setNotes(notes.map((note) => (note.place === oldName ? { ...note, place: editTagText } : note)));
    }

    setEditingTagId(null);
    setEditTagText('');
  };

  const deleteTag = (id: number) => {
    setPlaces(places.filter((place) => place.id !== id));

    setNotes(
      notes.map((note) => {
        const placeName = places.find((p) => p.id === id)?.name;
        if (note.place === placeName) {
          return { ...note, place: null };
        }
        return note;
      }),
    );
  };

  return {
    editingTagId,
    editTagText,
    editTagColor,
    setEditingTagId,
    setEditTagText,
    setEditTagColor,
    startEditingTag,
    saveTag,
    deleteTag,
  };
};
