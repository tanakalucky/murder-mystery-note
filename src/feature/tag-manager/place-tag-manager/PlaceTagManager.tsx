import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { usePlaceStore } from '@/store/place-store';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { DraggableTag } from '../components/DraggableTag';
import { TAG_TYPES } from '../types';
import { usePlaceTag } from './hooks';

export const PlaceTagManager = () => {
  const { places, setPlaces } = usePlaceStore();
  const [newPlaceText, setNewPlaceText] = useState('');
  const [newTagColor, setNewTagColor] = useState('#FFFFFF');
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
  } = usePlaceTag();

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
      <h3 className="text-sm font-semibold mb-2">場所</h3>
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={newPlaceText}
          onChange={(e) => setNewPlaceText(e.target.value)}
          placeholder="新しい場所を追加"
          className="flex-1 text-sm"
        />
        <Input type="color" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} className="w-10" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (newPlaceText.trim() === '') return;
            const newPlace = {
              id: Date.now(),
              name: newPlaceText,
              color: newTagColor,
            };
            setPlaces([...places, newPlace]);
            setNewPlaceText('');
          }}
        >
          追加
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {places.map((place) => (
          <div
            key={place.id}
            className="relative bg-card border rounded-md px-2 py-1 flex items-center gap-1 text-xs group"
            style={{ borderLeftColor: place.color, borderLeftWidth: '4px' }}
          >
            {editingTagId === place.id ? (
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
                  handleDragStart(e, { id: place.id, type: TAG_TYPES.PLACE, text: place.name, color: place.color })
                }
                handleDragEnd={handleDragEnd}
                onEditTag={() => startEditingTag(place.id, place.name, place.color)}
                onDeleteTag={() => deleteTag(place.id)}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: place.color }}></div>
                <MapPin className="h-2 w-2" style={{ color: place.color }} />
                <span className="truncate">{place.name}</span>
              </DraggableTag>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
