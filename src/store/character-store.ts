/**
 * キャラクター情報を管理するZustandストア
 *
 * このモジュールは、アプリケーション全体でキャラクター情報を管理するためのグローバルストアを提供します。
 * Zustandを使用して状態管理を行い、キャラクターの追加、削除、更新などの機能を提供します。
 */

import { create } from 'zustand';

// キャラクターの型定義
export interface Character {
  id: number;
  name: string;
  color: string;
}

// ストアの状態の型定義
interface CharacterState {
  // キャラクターの配列
  characters: Character[];

  // キャラクターの配列を設定する関数
  setCharacters: (characters: Character[]) => void;

  // キャラクター名から色を取得するヘルパー関数
  getCharacterColor: (charName: string) => string;
}

// Zustandストアの作成
export const useCharacterStore = create<CharacterState>((set, get) => ({
  // 初期状態は空の配列
  characters: [],

  // キャラクターの配列を設定する関数
  setCharacters: (characters: Character[]) => {
    set({ characters });
  },

  // キャラクター名から色を取得するヘルパー関数
  getCharacterColor: (charName: string) => {
    const { characters } = get();
    const character = characters.find((char) => char.name === charName);
    return character ? character.color : '#000000';
  },
}));
