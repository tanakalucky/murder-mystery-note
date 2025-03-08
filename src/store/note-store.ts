/**
 * ノートデータを管理するZustandストア
 *
 * このモジュールは、アプリケーション全体でノートデータを管理するためのグローバルストアを提供します。
 * Zustandを使用して状態管理を行い、ノートの追加、削除、タグの追加・削除などの機能を提供します。
 */

import { TagType } from '@/feature/tag-manager/types';
import { create } from 'zustand';

// ノートの型定義
export interface Note {
  id: number;
  content: string;
  character: string | null;
  place: string | null;
  time: string | null;
  date: string | null;
  createdAt: string;
}

// ストアの状態の型定義
interface NotesState {
  // ノートの配列
  notes: Note[];

  // ノートの配列を直接設定する関数（既存コードとの互換性のため）
  setNotes: (notes: Note[]) => void;

  // ノートを追加する関数
  addNote: (content: string) => void;

  // ノートを削除する関数
  deleteNote: (noteId: number) => void;

  // ノートにタグを追加する関数
  addTagToNote: (noteId: number, tagType: TagType, tagValue: string) => void;

  // ノートからタグを削除する関数
  removeTagFromNote: (noteId: number, tagType: TagType) => void;
}

// Zustandストアの作成
export const useNotesStore = create<NotesState>((set) => ({
  // 初期状態は空の配列
  notes: [],

  // ノートの配列を直接設定する関数
  setNotes: (notes: Note[]) => {
    set({ notes });
  },

  // ノートを追加する関数
  addNote: (content: string) => {
    if (content.trim() === '') return;

    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: Date.now(),
          content,
          character: null,
          place: null,
          time: null,
          date: null,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  // ノートを削除する関数
  deleteNote: (noteId: number) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
    }));
  },

  // ノートにタグを追加する関数
  addTagToNote: (noteId: number, tagType: TagType, tagValue: string) => {
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            [tagType]: tagValue,
          };
        }
        return note;
      }),
    }));
  },

  // ノートからタグを削除する関数
  removeTagFromNote: (noteId: number, tagType: TagType) => {
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === noteId) {
          const updatedNote = { ...note };
          updatedNote[tagType] = null;
          return updatedNote;
        }
        return note;
      }),
    }));
  },
}));
