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
import { TAG_TYPES } from '../tag-manager/types';

const Memo = () => {
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
                      className="flex-1 min-h-[24px] text-sm p-1 focus-visible:ring-1 text-foreground bg-muted"
                    />
                  ) : (
                    <div
                      className="whitespace-pre-wrap text-sm flex-1 text-foreground"
                      onDoubleClick={() => {
                        setEditingNote(note.id);
                        setEditNoteContent(note.content);
                      }}
                    >
                      {note.content}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="h-5 w-5 p-0 text-destructive hover:text-destructive-foreground flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mt-1 text-[10px] leading-none">
                  {note.character && (
                    <div
                      className="flex items-center bg-secondary border rounded-full px-1.5 py-0.5"
                      style={{ borderColor: getCharacterColor(note.character) }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-0.5"
                        style={{ backgroundColor: getCharacterColor(note.character) }}
                      ></div>
                      <span className="text-foreground">{note.character}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, TAG_TYPES.CHARACTER);
                        }}
                        className="ml-0.5 text-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {note.place && (
                    <div
                      className="flex items-center bg-secondary border rounded-full px-1.5 py-0.5"
                      style={{ borderColor: getPlaceColor(note.place) }}
                    >
                      <MapPin className="h-1.5 w-1.5 mr-0.5" style={{ color: getPlaceColor(note.place) }} />
                      <span className="text-foreground">{note.place}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, TAG_TYPES.PLACE);
                        }}
                        className="ml-0.5 text-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {note.time && (
                    <div className="flex items-center bg-secondary border rounded-full px-1.5 py-0.5 border-primary">
                      <Clock className="h-1.5 w-1.5 mr-0.5 text-primary" />
                      <span className="text-foreground">{note.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, TAG_TYPES.TIME);
                        }}
                        className="ml-0.5 text-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {note.date && (
                    <div className="flex items-center bg-secondary border rounded-full px-1.5 py-0.5 border-primary">
                      <Calendar className="h-1.5 w-1.5 mr-0.5 text-primary" />
                      <span className="text-foreground">{note.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, TAG_TYPES.DATE);
                        }}
                        className="ml-0.5 text-foreground hover:text-destructive"
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

      <div className="mt-4 pt-4 border-t flex-shrink-0">
        <div className="flex items-end border rounded-md p-2 bg-muted border-primary">
          <Textarea
            placeholder="メモを入力してください...(Enterで送信、Shift+Enterで改行)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[36px] max-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto py-1 text-foreground bg-muted"
            rows={newNote.includes('\n') ? Math.min(newNote.split('\n').length, 6) : 1}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddNote}
            className="ml-2 self-end h-9 w-9 p-0 rounded-full text-primary hover:text-primary-foreground hover:bg-primary"
            disabled={newNote.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Memo;
