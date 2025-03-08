/**
 * 場所情報を管理するZustandストア
 *
 * このモジュールは、アプリケーション全体で場所情報を管理するためのグローバルストアを提供します。
 * Zustandを使用して状態管理を行い、場所の追加、削除、更新などの機能を提供します。
 */

import { create } from 'zustand';

// 場所の型定義
export interface Place {
  id: number;
  name: string;
  color: string;
}

// ストアの状態の型定義
interface PlaceState {
  // 場所の配列
  places: Place[];

  // 場所の配列を設定する関数
  setPlaces: (places: Place[]) => void;

  // 場所名から色を取得するヘルパー関数
  getPlaceColor: (placeName: string) => string;
}

// Zustandストアの作成
export const usePlaceStore = create<PlaceState>((set, get) => ({
  // 初期状態は空の配列
  places: [],

  // 場所の配列を設定する関数
  setPlaces: (places: Place[]) => {
    set({ places });
  },

  // 場所名から色を取得するヘルパー関数
  getPlaceColor: (placeName: string) => {
    const { places } = get();
    const place = places.find((p) => p.name === placeName);
    return place ? place.color : '#000000';
  },
}));
