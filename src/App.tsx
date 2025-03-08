import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Send, Tag, Trash2 } from 'lucide-react';
import React, { useState, useRef } from 'react';

// ノートの型定義
interface Note {
  id: number;
  content: string;
  character: string | null;
  place: string | null;
  time: string | null;
  date: string | null;
  createdAt: string;
}

// キャラクターの型定義
interface Character {
  id: number;
  name: string;
  color: string;
}

// 場所の型定義
interface Place {
  id: number;
  name: string;
  color: string;
}

// タグの型定義
interface Tag {
  id: number;
  type: 'character' | 'place' | 'time' | 'date';
  text: string;
  color?: string;
}

const DragDropMysteryApp = () => {
  // 状態管理
  const [notes, setNotes] = useState<Note[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [quickTimes, setQuickTimes] = useState<string[]>([]);
  const [quickDates, setQuickDates] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newCharacterText, setNewCharacterText] = useState('');
  const [newPlaceText, setNewPlaceText] = useState('');
  const [newTimeText, setNewTimeText] = useState('');
  const [newDateText, setNewDateText] = useState('');
  const [newTagColor, setNewTagColor] = useState('#000000');
  const [rightPanelMode, setRightPanelMode] = useState<'tags' | 'timeline'>('tags');
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagType, setEditingTagType] = useState<'character' | 'place' | 'time' | 'date' | null>(null);
  const [editTagText, setEditTagText] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  const dragItem = useRef<Tag | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // メモを追加
  const addNote = () => {
    if (newNote.trim() === '') return;

    const noteObj = {
      id: Date.now(),
      content: newNote,
      character: null,
      place: null,
      time: null,
      date: null,
      createdAt: new Date().toISOString(),
    };

    setNotes([...notes, noteObj]);
    setNewNote('');
  };

  // タグをドラッグ開始時のハンドラ
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tag: Tag) => {
    // タグの情報をドラッグデータに設定
    e.dataTransfer.setData('application/json', JSON.stringify(tag));
    dragItem.current = tag;

    // ドラッグ中の見た目の設定
    if (e.currentTarget.classList) {
      setTimeout(() => {
        e.currentTarget.classList.add('opacity-50');
      }, 0);
    }
  };

  // ドラッグ終了時のハンドラー
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('opacity-50');
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // ドラッグ中にメモの上に来た時のハンドラー
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
    e.preventDefault();
    dragOverItem.current = noteId;

    // ドロップ可能エリアの視覚的なフィードバック
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('border-primary');
    }
  };

  // ドラッグがメモの上から離れた時のハンドラー
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('border-primary');
    }
  };

  // メモにタグをドロップした時のハンドラー
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
    e.preventDefault();

    // ドロップ時の視覚的フィードバックをリセット
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('border-primary');
    }

    // ドロップされたタグデータを取得
    const tagData = e.dataTransfer.getData('application/json');
    if (!tagData) return;

    const tag = JSON.parse(tagData) as Tag;

    // ノートを更新
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const updatedNote = { ...note };

          // タグの種類に応じてノートの対応するフィールドを更新
          switch (tag.type) {
            case 'character':
              updatedNote.character = updatedNote.character === tag.text ? null : tag.text;
              break;
            case 'place':
              updatedNote.place = updatedNote.place === tag.text ? null : tag.text;
              break;
            case 'time':
              updatedNote.time = updatedNote.time === tag.text ? null : tag.text;
              break;
            case 'date':
              updatedNote.date = updatedNote.date === tag.text ? null : tag.text;
              break;
          }

          return updatedNote;
        }
        return note;
      }),
    );
  };

  // タグをノートから削除
  const removeTag = (noteId: number, tagType: 'character' | 'place' | 'time' | 'date') => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const updatedNote = { ...note };

          switch (tagType) {
            case 'character':
              updatedNote.character = null;
              break;
            case 'place':
              updatedNote.place = null;
              break;
            case 'time':
              updatedNote.time = null;
              break;
            case 'date':
              updatedNote.date = null;
              break;
          }

          return updatedNote;
        }
        return note;
      }),
    );
  };

  // メモを削除
  const deleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  // キーボードイベントハンドラー
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 日本語入力中はEnterキーでの送信を無効化
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      addNote();
    }
  };

  // キャラクター名から色を取得するヘルパー関数
  const getCharacterColor = (charName: string) => {
    const character = characters.find((char) => char.name === charName);
    return character ? character.color : '#000000';
  };

  // 場所名から色を取得するヘルパー関数
  const getPlaceColor = (placeName: string) => {
    const place = places.find((p) => p.name === placeName);
    return place ? place.color : '#000000';
  };

  // フィルター適用後のノート
  const filteredNotes = notes;

  // タイムライン用のグループ化（時間順）
  const timelineNotes = [...filteredNotes]
    .filter((note) => note.time)
    .sort((a, b) => {
      // 日付でソート
      const dateCompare = (a.date || '').localeCompare(b.date || '');
      if (dateCompare !== 0) return dateCompare;

      // 時間でソート
      return (a.time || '').localeCompare(b.time || '');
    });

  // 日付ごとにグループ化
  const groupedByDate = timelineNotes.reduce<Record<string, Note[]>>((acc, note) => {
    const dateKey = note.date || '日付不明';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(note);
    return acc;
  }, {});

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
        oldName = quickTimes[editingTagId];

        // 時間情報を更新
        setQuickTimes(quickTimes.map((time, index) => (index === editingTagId ? editTagText : time)));

        // 関連するメモも更新
        if (oldName) {
          setNotes(notes.map((note) => (note.time === oldName ? { ...note, time: editTagText } : note)));
        }
        break;
      case 'date':
        // 変更前の日付を取得
        oldName = quickDates[editingTagId];

        // 日付情報を更新
        setQuickDates(quickDates.map((date, index) => (index === editingTagId ? editTagText : date)));

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
        const timeValue = quickTimes[id];
        setQuickTimes(quickTimes.filter((_, index) => index !== id));
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
        const dateValue = quickDates[id];
        setQuickDates(quickDates.filter((_, index) => index !== id));
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

  // タグパレットのレンダリング
  const renderTagPalette = () => {
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
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10"
              />
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
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, { id: char.id, type: 'character', text: char.name, color: char.color })
                        }
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-1 cursor-move flex-1"
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }}></div>
                        <span className="truncate">{char.name}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex">
                        <button
                          onClick={() => startEditingTag(char.id, 'character', char.name, char.color)}
                          className="text-gray-500 hover:text-gray-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.474 5.408L18.592 7.526L6 20.118V22H8.118L20.71 9.408L22.828 11.526L23.535 10.819L13.181 0.465L12.474 1.172L14.592 3.29L16.474 5.408ZM13.185 7.112L13.644 7.571L15.354 9.281L18.829 5.807L16.647 3.625L13.185 7.112Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTag(char.id, 'character')}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H4C2.9 6 2 6.9 2 8V9C2 9.6 2.4 10 3 10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H21C21.6 10 22 9.6 22 9V8C22 6.9 21.1 6 20 6ZM10 5H14V6H10V5ZM18 20H6V10H18V20Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
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
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10"
              />
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
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, { id: place.id, type: 'place', text: place.name, color: place.color })
                        }
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-1 cursor-move flex-1"
                      >
                        <MapPin className="h-2 w-2" style={{ color: place.color }} />
                        <span className="truncate">{place.name}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex">
                        <button
                          onClick={() => startEditingTag(place.id, 'place', place.name, place.color)}
                          className="text-gray-500 hover:text-gray-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.474 5.408L18.592 7.526L6 20.118V22H8.118L20.71 9.408L22.828 11.526L23.535 10.819L13.181 0.465L12.474 1.172L14.592 3.29L16.474 5.408ZM13.185 7.112L13.644 7.571L15.354 9.281L18.829 5.807L16.647 3.625L13.185 7.112Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTag(place.id, 'place')}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H4C2.9 6 2 6.9 2 8V9C2 9.6 2.4 10 3 10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H21C21.6 10 22 9.6 22 9V8C22 6.9 21.1 6 20 6ZM10 5H14V6H10V5ZM18 20H6V10H18V20Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
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
                  if (newTimeText.trim() === '' || quickTimes.includes(newTimeText)) return;
                  setQuickTimes([...quickTimes, newTimeText]);
                  setNewTimeText('');
                }}
              >
                追加
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {quickTimes.map((time, index) => (
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
                    <>
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, { id: index, type: 'time', text: time })}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-1 cursor-move flex-1"
                      >
                        <Clock className="h-2 w-2 text-gray-500" />
                        <span className="truncate">{time}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex">
                        <button
                          onClick={() => startEditingTag(index, 'time', time)}
                          className="text-gray-500 hover:text-gray-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.474 5.408L18.592 7.526L6 20.118V22H8.118L20.71 9.408L22.828 11.526L23.535 10.819L13.181 0.465L12.474 1.172L14.592 3.29L16.474 5.408ZM13.185 7.112L13.644 7.571L15.354 9.281L18.829 5.807L16.647 3.625L13.185 7.112Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTag(index, 'time')}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H4C2.9 6 2 6.9 2 8V9C2 9.6 2.4 10 3 10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H21C21.6 10 22 9.6 22 9V8C22 6.9 21.1 6 20 6ZM10 5H14V6H10V5ZM18 20H6V10H18V20Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
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
                  if (newDateText.trim() === '' || quickDates.includes(newDateText)) return;
                  setQuickDates([...quickDates, newDateText]);
                  setNewDateText('');
                }}
              >
                追加
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {quickDates.map((date, index) => (
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
                    <>
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, { id: index, type: 'date', text: date })}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-1 cursor-move flex-1"
                      >
                        <Calendar className="h-2 w-2 text-gray-500" />
                        <span className="truncate">{date}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex">
                        <button
                          onClick={() => startEditingTag(index, 'date', date)}
                          className="text-gray-500 hover:text-gray-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.474 5.408L18.592 7.526L6 20.118V22H8.118L20.71 9.408L22.828 11.526L23.535 10.819L13.181 0.465L12.474 1.172L14.592 3.29L16.474 5.408ZM13.185 7.112L13.644 7.571L15.354 9.281L18.829 5.807L16.647 3.625L13.185 7.112Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTag(index, 'date')}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H4C2.9 6 2 6.9 2 8V9C2 9.6 2.4 10 3 10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H21C21.6 10 22 9.6 22 9V8C22 6.9 21.1 6 20 6ZM10 5H14V6H10V5ZM18 20H6V10H18V20Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  // タイムラインのレンダリング
  const renderTimeline = () => {
    if (Object.keys(groupedByDate).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
          <Clock className="h-12 w-12 mb-2 opacity-20" />
          <p>タイムラインに表示するデータがありません。</p>
          <p className="text-sm">メモに時間タグをドラッグしてください。</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full pr-2">
        <div className="space-y-3 p-2">
          {Object.entries(groupedByDate).map(([date, dateNotes], dateIndex) => (
            <div key={dateIndex} className="mb-6 last:mb-0">
              <div className="bg-gray-100 px-4 py-2 rounded-t-md border-b-2 border-gray-300 mb-2 sticky top-0 z-10">
                <h3 className="font-semibold text-gray-800">{date}</h3>
              </div>

              <div className="space-y-4 relative">
                <div className="absolute left-8 top-8 bottom-4 border-l-2 border-dashed border-gray-200 -z-10"></div>
                {dateNotes.map((note, index) => (
                  <Card key={index} className="bg-white shadow-sm py-0">
                    <CardContent className="p-0 overflow-hidden">
                      <div className="flex">
                        <div className="bg-gray-50 w-12 shrink-0 py-2 flex flex-col items-center justify-start border-r">
                          <span className="font-medium text-gray-700 text-xs">{note.time}</span>
                        </div>
                        <div className="flex-1 p-2">
                          <div className="flex flex-wrap items-start gap-1 mb-1 text-xs">
                            {note.character && (
                              <div className="flex items-center mr-1.5">
                                <div
                                  className="w-2 h-2 rounded-full mr-0.5"
                                  style={{ backgroundColor: getCharacterColor(note.character) }}
                                ></div>
                                <span>{note.character}</span>
                              </div>
                            )}
                            {note.place && (
                              <div className="flex items-center">
                                <MapPin className="h-2 w-2 mr-0.5" style={{ color: getPlaceColor(note.place) }} />
                                <span>{note.place}</span>
                              </div>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap text-gray-700 text-xs">{note.content}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左側：メモ一覧と入力 */}
      <div className="w-1/2 flex flex-col overflow-hidden p-4 border-r">
        <ScrollArea className="flex-1 pr-2 max-h-[calc(100vh-7rem)]">
          <div className="space-y-1 pb-2">
            {notes.map((note) => (
              <Card
                key={note.id}
                onDragOver={(e) => handleDragOver(e, note.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, note.id)}
                className="transition-colors border-2 py-0"
              >
                <CardContent className="p-2">
                  {/* メモ本文 */}
                  <div className="flex justify-between items-start gap-1">
                    {editingNote === note.id ? (
                      <Textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        onBlur={() => {
                          setNotes(notes.map((n) => (n.id === note.id ? { ...n, content: editNoteContent } : n)));
                          setEditingNote(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setNotes(notes.map((n) => (n.id === note.id ? { ...n, content: editNoteContent } : n)));
                            setEditingNote(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingNote(null);
                          }
                        }}
                        autoFocus
                        className="flex-1 min-h-[24px] text-sm p-1 focus-visible:ring-1"
                      />
                    ) : (
                      <div
                        className="whitespace-pre-wrap text-sm flex-1"
                        onDoubleClick={() => {
                          setEditingNote(note.id);
                          setEditNoteContent(note.content);
                        }}
                      >
                        {note.content}
                      </div>
                    )}

                    {/* 削除ボタン */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="h-5 w-5 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* タグ表示エリア */}
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px] leading-none">
                    {note.character && (
                      <div
                        className="flex items-center bg-white border rounded-full px-1.5 py-0.5"
                        style={{ borderColor: getCharacterColor(note.character) }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mr-0.5"
                          style={{ backgroundColor: getCharacterColor(note.character) }}
                        ></div>
                        <span>{note.character}</span>
                        <button
                          onClick={() => removeTag(note.id, 'character')}
                          className="ml-0.5 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {note.place && (
                      <div
                        className="flex items-center bg-white border rounded-full px-1.5 py-0.5"
                        style={{ borderColor: getPlaceColor(note.place) }}
                      >
                        <MapPin className="h-1.5 w-1.5 mr-0.5" style={{ color: getPlaceColor(note.place) }} />
                        <span>{note.place}</span>
                        <button
                          onClick={() => removeTag(note.id, 'place')}
                          className="ml-0.5 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {note.time && (
                      <div className="flex items-center bg-white border rounded-full px-1.5 py-0.5 border-gray-300">
                        <Clock className="h-1.5 w-1.5 mr-0.5 text-gray-500" />
                        <span>{note.time}</span>
                        <button
                          onClick={() => removeTag(note.id, 'time')}
                          className="ml-0.5 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {note.date && (
                      <div className="flex items-center bg-white border rounded-full px-1.5 py-0.5 border-gray-300">
                        <Calendar className="h-1.5 w-1.5 mr-0.5 text-gray-500" />
                        <span>{note.date}</span>
                        <button
                          onClick={() => removeTag(note.id, 'date')}
                          className="ml-0.5 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* メモ入力エリア */}
        <div className="mt-4 pt-4 border-t flex-shrink-0">
          <div
            className="flex items-end border rounded-md p-2 bg-white"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-primary');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-primary');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary');
              // 新規メモ入力欄へのドロップ処理（今回は実装しない）
            }}
          >
            <Textarea
              placeholder="メモを入力してください...(Enterで送信、Shift+Enterで改行)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[36px] max-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto py-1"
              rows={newNote.includes('\n') ? Math.min(newNote.split('\n').length, 6) : 1}
            />
            <Button
              variant="ghost"
              onClick={addNote}
              className="ml-2 self-end h-9 w-9 p-0 rounded-full"
              disabled={newNote.trim() === ''}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1 px-2">タグをドラッグ＆ドロップしてメモに追加できます</div>
        </div>
      </div>

      {/* 右側：タグパレットと参照ビュー */}
      <div className="w-1/2 bg-white p-4 overflow-hidden flex flex-col">
        {/* 上部切り替えタブ */}
        <div className="mb-3 border-b">
          <div className="flex bg-muted rounded-t-md overflow-hidden">
            <button
              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm ${rightPanelMode === 'tags' ? 'bg-white font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setRightPanelMode('tags')}
            >
              <Tag className="mr-1 h-4 w-4" />
              タグ
            </button>
            <button
              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm ${rightPanelMode === 'timeline' ? 'bg-white font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setRightPanelMode('timeline')}
            >
              <Clock className="mr-1 h-4 w-4" />
              タイムライン
            </button>
          </div>
        </div>

        {rightPanelMode === 'tags' ? renderTagPalette() : renderTimeline()}
      </div>
    </div>
  );
};

export default DragDropMysteryApp;
