import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { useDateStore } from '@/store/date-store';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { DraggableTag } from '../components/DraggableTag';
import { TAG_TYPES } from '../types';
import { useDateTag } from './hooks';

export const DateTagManager = () => {
  const { dates, setDates } = useDateStore();
  const [newDateText, setNewDateText] = useState('');
  const { handleDragStart, handleDragEnd } = useDragAndDrop();
  const { editingTagId, editTagText, setEditingTagId, setEditTagText, startEditingTag, saveTag, deleteTag } =
    useDateTag();

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
                handleDragStart={(e) => handleDragStart(e, { id: index, type: TAG_TYPES.DATE, text: date })}
                handleDragEnd={handleDragEnd}
                onEditTag={() => startEditingTag(index, date)}
                onDeleteTag={() => deleteTag(index)}
              >
                <Calendar className="h-2 w-2 text-gray-500" />
                <span className="truncate">{date}</span>
              </DraggableTag>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
