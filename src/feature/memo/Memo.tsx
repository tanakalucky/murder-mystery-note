import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { useCharacterStore } from '@/store/character-store';
import { useNotesStore } from '@/store/note-store';
import { usePlaceStore } from '@/store/place-store';
import { Calendar, Clock, MapPin, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

export const Memo = () => {
  const { notes, setNotes, addNote, deleteNote, removeTagFromNote } = useNotesStore();
  const { getCharacterColor } = useCharacterStore();
  const { getPlaceColor } = usePlaceStore();
  const { handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop();
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    addNote(newNote);
    setNewNote('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 日本語入力中はEnterキーでの送信を無効化
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, 'character');
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, 'place');
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, 'time');
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, 'date');
                        }}
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
            onClick={handleAddNote}
            className="ml-2 self-end h-9 w-9 p-0 rounded-full"
            disabled={newNote.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-1 px-2">タグをドラッグ＆ドロップしてメモに追加できます</div>
      </div>
    </>
  );
};
