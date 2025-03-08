import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { useCharacterStore } from '@/store/character-store';
import { useState } from 'react';
import { DraggableTag } from '../components/DraggableTag';
import { useCharaterTag } from './hooks';

export const CharacterTagManager = () => {
  const [newCharacterText, setNewCharacterText] = useState('');
  const [newTagColor, setNewTagColor] = useState('#000000');
  const { characters, setCharacters } = useCharacterStore();
  const { handleDragStart, handleDragEnd } = useDragAndDrop();
  const {
    editingTagId,
    editTagText,
    editTagColor,
    setEditingTagId,
    setEditTagText,
    setEditTagColor,
    startEditingTag,
    saveTag,
    deleteTag,
  } = useCharaterTag();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 日本語入力中はEnterキーでの送信を無効化
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      saveTag();
    }
    if (e.key === 'Escape') {
      setEditingTagId(null);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">キャラクター</h3>
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={newCharacterText}
          onChange={(e) => setNewCharacterText(e.target.value)}
          placeholder="新しいキャラクターを追加"
          className="flex-1 text-sm"
        />

        <Input type="color" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} className="w-10" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (newCharacterText.trim() === '') return;
            const newChar = {
              id: Date.now(),
              name: newCharacterText,
              color: newTagColor,
            };
            setCharacters([...characters, newChar]);
            setNewCharacterText('');
          }}
        >
          追加
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {characters.map((char) => (
          <div
            key={char.id}
            className="relative bg-card border rounded-md px-2 py-1 flex items-center gap-1 text-xs group"
            style={{ borderLeftColor: char.color, borderLeftWidth: '4px' }}
          >
            {editingTagId === char.id ? (
              <div className="flex items-center w-full gap-1">
                <Input
                  value={editTagText}
                  onChange={(e) => setEditTagText(e.target.value)}
                  className="h-5 text-xs px-1 py-0 w-full"
                  autoFocus
                  onKeyDown={handleKeyDown}
                />
                <Input
                  type="color"
                  value={editTagColor}
                  onChange={(e) => setEditTagColor(e.target.value)}
                  className="w-5 h-5 p-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveTag();
                    }}
                    className="text-green-500 hover:text-green-700 p-0.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTagId(null);
                    }}
                    className="text-red-500 hover:text-red-700 p-0.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <DraggableTag
                handleDragStart={(e) =>
                  handleDragStart(e, { id: char.id, type: 'character', text: char.name, color: char.color })
                }
                handleDragEnd={handleDragEnd}
                onEditTag={() => startEditingTag(char.id, char.name, char.color)}
                onDeleteTag={() => deleteTag(char.id)}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }}></div>
                <span className="truncate">{char.name}</span>
              </DraggableTag>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
