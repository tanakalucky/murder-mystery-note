import { TagType } from '@/feature/tag-manager/types';
import { useNotesStore } from '@/store/note-store';
import { DragEvent, useRef } from 'react';

interface Tag {
  id: number;
  type: TagType;
  text: string;
  color?: string;
}

type DragAndDropProps = {
  handleDragStart: (e: DragEvent<HTMLDivElement>, tag: Tag) => void;
  handleDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>, noteId: number) => void;
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, noteId: number) => void;
};

export const useDragAndDrop = (): DragAndDropProps => {
  const dragItem = useRef<Tag | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const { addTagToNote } = useNotesStore();

  const handleDragStart = (e: DragEvent<HTMLDivElement>, tag: Tag) => {
    // タグの情報をドラッグデータに設定
    e.dataTransfer.setData('application/json', JSON.stringify(tag));
    dragItem.current = tag;

    if (e.currentTarget.classList) {
      // setTimeout(() => {
      e.currentTarget.classList.add('opacity-50');
      // }, 0);
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('opacity-50');
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, noteId: number) => {
    e.preventDefault();
    dragOverItem.current = noteId;

    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('border-primary');
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('border-primary');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, noteId: number) => {
    e.preventDefault();

    // ドロップされたタグのデータを取得
    const tagData = JSON.parse(e.dataTransfer.getData('application/json')) as Tag;

    // ドロップされたタグの種類に応じて処理
    if (tagData) {
      addTagToNote(noteId, tagData.type, tagData.text);
    }

    dragItem.current = null;
    dragOverItem.current = null;

    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-gray-100');
      e.currentTarget.classList.remove('border-primary');
    }
  };

  return { handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop };
};
