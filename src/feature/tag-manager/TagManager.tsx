import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { useCharacterStore } from '@/store/character-store';
import { useDateStore } from '@/store/date-store';
import { useNotesStore } from '@/store/note-store';
import { usePlaceStore } from '@/store/place-store';
import { useTimeStore } from '@/store/time-store';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { DraggableTag } from './components/DraggableTag';

export const TagManager = () => {
  const { notes, setNotes } = useNotesStore();
  const { characters, setCharacters } = useCharacterStore();
  const { places, setPlaces } = usePlaceStore();
  const { times, setTimes } = useTimeStore();
  const { dates, setDates } = useDateStore();
  const [newCharacterText, setNewCharacterText] = useState('');
  const [newPlaceText, setNewPlaceText] = useState('');
  const [newTimeText, setNewTimeText] = useState('');
  const [newDateText, setNewDateText] = useState('');
  const [newTagColor, setNewTagColor] = useState('#000000');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagType, setEditingTagType] = useState<'character' | 'place' | 'time' | 'date' | null>(null);
  const [editTagText, setEditTagText] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  // タグを編集
  const startEditingTag = (id: number, type: 'character' | 'place' | 'time' | 'date', text: string, color?: string) => {
    setEditingTagId(id);
    setEditingTagType(type);
    setEditTagText(text);
    if (color) setEditTagColor(color);
  };

  const saveTagEdit = () => {
    if (!editingTagType || editingTagId === null || editTagText.trim() === '') return;

    // 古い名前を保持しておく
    let oldName = '';

    switch (editingTagType) {
      case 'character':
        // 変更前の名前を取得
        oldName = characters.find((char) => char.id === editingTagId)?.name || '';

        // キャラクター情報を更新
        setCharacters(
          characters.map((char) =>
            char.id === editingTagId ? { ...char, name: editTagText, color: editTagColor } : char,
          ),
        );

        // 関連するメモも更新
        if (oldName) {
          setNotes(notes.map((note) => (note.character === oldName ? { ...note, character: editTagText } : note)));
        }
        break;
      case 'place':
        // 変更前の名前を取得
        oldName = places.find((place) => place.id === editingTagId)?.name || '';

        // 場所情報を更新
        setPlaces(
          places.map((place) =>
            place.id === editingTagId ? { ...place, name: editTagText, color: editTagColor } : place,
          ),
        );

        // 関連するメモも更新
        if (oldName) {
          setNotes(notes.map((note) => (note.place === oldName ? { ...note, place: editTagText } : note)));
        }
        break;
      case 'time':
        // 変更前の時間を取得
        oldName = times[editingTagId];

        // 時間情報を更新
        setTimes(times.map((time, index) => (index === editingTagId ? editTagText : time)));

        // 関連するメモも更新
        if (oldName) {
          setNotes(notes.map((note) => (note.time === oldName ? { ...note, time: editTagText } : note)));
        }
        break;
      case 'date':
        // 変更前の日付を取得
        oldName = dates[editingTagId];

        // 日付情報を更新
        setDates(dates.map((date, index) => (index === editingTagId ? editTagText : date)));

        // 関連するメモも更新
        if (oldName) {
          setNotes(notes.map((note) => (note.date === oldName ? { ...note, date: editTagText } : note)));
        }
        break;
    }

    // 編集状態をリセット
    setEditingTagId(null);
    setEditingTagType(null);
    setEditTagText('');
  };

  // タグを削除
  const deleteTag = (id: number, type: 'character' | 'place' | 'time' | 'date') => {
    switch (type) {
      case 'character':
        setCharacters(characters.filter((char) => char.id !== id));
        // キャラクターを使用しているノートからタグを削除
        setNotes(
          notes.map((note) => {
            const charName = characters.find((c) => c.id === id)?.name;
            if (note.character === charName) {
              return { ...note, character: null };
            }
            return note;
          }),
        );
        break;
      case 'place':
        setPlaces(places.filter((place) => place.id !== id));
        // 場所を使用しているノートからタグを削除
        setNotes(
          notes.map((note) => {
            const placeName = places.find((p) => p.id === id)?.name;
            if (note.place === placeName) {
              return { ...note, place: null };
            }
            return note;
          }),
        );
        break;
      case 'time':
        const timeValue = times[id];
        setTimes(times.filter((_, index) => index !== id));
        // 時間を使用しているノートからタグを削除
        setNotes(
          notes.map((note) => {
            if (note.time === timeValue) {
              return { ...note, time: null };
            }
            return note;
          }),
        );
        break;
      case 'date':
        const dateValue = dates[id];
        setDates(dates.filter((_, index) => index !== id));
        // 日付を使用しているノートからタグを削除
        setNotes(
          notes.map((note) => {
            if (note.date === dateValue) {
              return { ...note, date: null };
            }
            return note;
          }),
        );
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 max-h-[calc(100vh-12rem)]">
        {/* キャラクタータグ */}
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
                {editingTagId === char.id && editingTagType === 'character' ? (
                  <div className="flex items-center w-full gap-1">
                    <Input
                      value={editTagText}
                      onChange={(e) => setEditTagText(e.target.value)}
                      className="h-5 text-xs px-1 py-0 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTagEdit();
                        if (e.key === 'Escape') {
                          setEditingTagId(null);
                          setEditingTagType(null);
                        }
                      }}
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
                          saveTagEdit();
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
                          setEditingTagType(null);
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
                    onEditTag={() => startEditingTag(char.id, 'character', char.name, char.color)}
                    onDeleteTag={() => deleteTag(char.id, 'character')}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }}></div>
                    <span className="truncate">{char.name}</span>
                  </DraggableTag>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 場所タグ */}
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
                {editingTagId === place.id && editingTagType === 'place' ? (
                  <div className="flex items-center w-full gap-1">
                    <Input
                      value={editTagText}
                      onChange={(e) => setEditTagText(e.target.value)}
                      className="h-5 text-xs px-1 py-0 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTagEdit();
                        if (e.key === 'Escape') {
                          setEditingTagId(null);
                          setEditingTagType(null);
                        }
                      }}
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
                          saveTagEdit();
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
                          setEditingTagType(null);
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
                      handleDragStart(e, { id: place.id, type: 'place', text: place.name, color: place.color })
                    }
                    handleDragEnd={handleDragEnd}
                    onEditTag={() => startEditingTag(place.id, 'place', place.name, place.color)}
                    onDeleteTag={() => deleteTag(place.id, 'place')}
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

        {/* 時間タグ */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">時間</h3>
          <div className="flex items-center gap-2 mb-2">
            <Input
              value={newTimeText}
              onChange={(e) => setNewTimeText(e.target.value)}
              placeholder="新しい時間を追加"
              className="flex-1 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (newTimeText.trim() === '' || times.includes(newTimeText)) return;
                setTimes([...times, newTimeText]);
                setNewTimeText('');
              }}
            >
              追加
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {times.map((time, index) => (
              <div
                key={index}
                className="relative bg-card border rounded-md px-2 py-1 flex items-center gap-1 text-xs group"
              >
                {editingTagId === index && editingTagType === 'time' ? (
                  <Input
                    value={editTagText}
                    onChange={(e) => setEditTagText(e.target.value)}
                    className="h-5 text-xs px-1 py-0 w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTagEdit();
                      if (e.key === 'Escape') {
                        setEditingTagId(null);
                        setEditingTagType(null);
                      }
                    }}
                  />
                ) : (
                  <DraggableTag
                    handleDragStart={(e) => handleDragStart(e, { id: index, type: 'time', text: time })}
                    handleDragEnd={handleDragEnd}
                    onEditTag={() => startEditingTag(index, 'time', time)}
                    onDeleteTag={() => deleteTag(index, 'time')}
                  >
                    <Clock className="h-2 w-2 text-gray-500" />
                    <span className="truncate">{time}</span>
                  </DraggableTag>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 日付タグ */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">日付</h3>
          <div className="flex items-center gap-2 mb-2">
            <Input
              value={newDateText}
              onChange={(e) => setNewDateText(e.target.value)}
              placeholder="新しい日付を追加 (例: 1日目)"
              className="flex-1 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (newDateText.trim() === '' || dates.includes(newDateText)) return;
                setDates([...dates, newDateText]);
                setNewDateText('');
              }}
            >
              追加
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {dates.map((date, index) => (
              <div
                key={index}
                className="relative bg-card border rounded-md px-2 py-1 flex items-center gap-1 text-xs group"
              >
                {editingTagId === index && editingTagType === 'date' ? (
                  <Input
                    value={editTagText}
                    onChange={(e) => setEditTagText(e.target.value)}
                    className="h-5 text-xs px-1 py-0 w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTagEdit();
                      if (e.key === 'Escape') {
                        setEditingTagId(null);
                        setEditingTagType(null);
                      }
                    }}
                  />
                ) : (
                  <DraggableTag
                    handleDragStart={(e) => handleDragStart(e, { id: index, type: 'date', text: date })}
                    handleDragEnd={handleDragEnd}
                    onEditTag={() => startEditingTag(index, 'date', date)}
                    onDeleteTag={() => deleteTag(index, 'date')}
                  >
                    <Calendar className="h-2 w-2 text-gray-500" />
                    <span className="truncate">{date}</span>
                  </DraggableTag>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
