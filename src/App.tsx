import { Clock, Tag } from 'lucide-react';
import { useState } from 'react';
import { Memo } from './feature/memo/Memo';
import { TagManager } from './feature/tag-manager/TagManager';
import { Timeline } from './feature/timeline/Timeline';

const DragDropMysteryApp = () => {
  const [rightPanelMode, setRightPanelMode] = useState<'tags' | 'timeline'>('tags');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左側：メモ一覧と入力 */}
      <div className="w-1/2 flex flex-col overflow-hidden p-4 border-r">
        <Memo />
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

        {rightPanelMode === 'tags' ? <TagManager /> : <Timeline />}
      </div>
    </div>
  );
};

export default DragDropMysteryApp;
