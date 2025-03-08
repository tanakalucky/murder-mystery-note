import { useCharacterStore } from '@/store/character-store';
import { useNotesStore } from '@/store/note-store';
import { useState } from 'react';

type UseCharacterTag = {
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

export const useCharacterTag = (): UseCharacterTag => {
  const { notes, setNotes } = useNotesStore();
  const { characters, setCharacters } = useCharacterStore();
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

    const oldName = characters.find((char) => char.id === editingTagId)?.name || '';

    // キャラクター情報を更新
    setCharacters(
      characters.map((char) => (char.id === editingTagId ? { ...char, name: editTagText, color: editTagColor } : char)),
    );

    // 関連するメモも更新
    if (oldName) {
      setNotes(notes.map((note) => (note.character === oldName ? { ...note, character: editTagText } : note)));
    }

    setEditingTagId(null);
    setEditTagText('');
  };

  const deleteTag = (id: number) => {
    setCharacters(characters.filter((char) => char.id !== id));

    const charName = characters.find((c) => c.id === id)?.name;
    setNotes(
      notes.map((note) => {
        if (note.character === charName) {
          return { ...note, character: null };
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
