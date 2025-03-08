import { useNotesStore } from '@/store/note-store';
import { DragEvent, useRef } from 'react';

interface Tag {
  id: number;
  type: 'character' | 'place' | 'time' | 'date';
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

    // ドロップされたタグのデータを取得
    const tagData = JSON.parse(e.dataTransfer.getData('application/json')) as Tag;

    // ドロップされたタグの種類に応じて処理
    if (tagData) {
      addTagToNote(noteId, tagData.type, tagData.text);
    }

    // ドラッグ関連の参照をクリア
    dragItem.current = null;
    dragOverItem.current = null;

    // ドロップターゲットのスタイルをリセット
    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-gray-100');
      e.currentTarget.classList.remove('border-primary');
    }
  };

  return { handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop };
};
