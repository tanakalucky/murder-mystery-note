import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { useTimeStore } from '@/store/time-store';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { DraggableTag } from '../components/DraggableTag';
import { useTimeTag } from './hooks';

export const TimeTagManger = () => {
  const { times, setTimes } = useTimeStore();
  const [newTimeText, setNewTimeText] = useState('');
  const { handleDragStart, handleDragEnd } = useDragAndDrop();
  const { editingTagId, editTagText, setEditingTagId, setEditTagText, startEditingTag, saveTag, deleteTag } =
    useTimeTag();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            {editingTagId === index ? (
              <Input
                value={editTagText}
                onChange={(e) => setEditTagText(e.target.value)}
                className="h-5 text-xs px-1 py-0 w-full"
                autoFocus
                onKeyDown={handleKeyDown}
              />
            ) : (
              <DraggableTag
                handleDragStart={(e) => handleDragStart(e, { id: index, type: 'time', text: time })}
                handleDragEnd={handleDragEnd}
                onEditTag={() => startEditingTag(index, time)}
                onDeleteTag={() => deleteTag(index)}
              >
                <Clock className="h-2 w-2 text-gray-500" />
                <span className="truncate">{time}</span>
              </DraggableTag>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
