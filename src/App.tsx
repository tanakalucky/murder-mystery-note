import { FileQuestion, FileText, Tag, TimerIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Memo } from './feature/memo/Memo';
import { PdfManager } from './feature/pdf-manager/PdfManager';
import { TagManager } from './feature/tag-manager/TagManager';
import { Timeline } from './feature/timeline/Timeline';

const DragDropMysteryApp = () => {
  const [rightPanelMode, setRightPanelMode] = useState<'tags' | 'timeline' | 'pdf'>('tags');

  // 常にダークモードを適用
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左側のメモパネル */}
      <div className="w-1/2 flex flex-col overflow-hidden p-4 border-r">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-xl font-serif tracking-wider text-primary flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-destructive" />
            ミステリーノート
          </h2>
        </div>
        <Memo />
      </div>

      {/* 右側のパネル */}
      <div className="w-1/2 p-4 overflow-hidden flex flex-col">
        <div className="mb-3 border-b">
          <div className="flex bg-muted rounded-t-md overflow-hidden">
            <button
              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm ${rightPanelMode === 'tags' ? 'bg-secondary font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setRightPanelMode('tags')}
            >
              <Tag className="mr-1 h-4 w-4 text-primary" />
              証拠タグ
            </button>
            <button
              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm ${rightPanelMode === 'timeline' ? 'bg-secondary font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setRightPanelMode('timeline')}
            >
              <TimerIcon className="mr-1 h-4 w-4 text-primary" />
              事件タイムライン
            </button>
            <button
              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm ${rightPanelMode === 'pdf' ? 'bg-secondary font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setRightPanelMode('pdf')}
            >
              <FileText className="mr-1 h-4 w-4 text-primary" />
              証拠書類
            </button>
          </div>
        </div>

        {rightPanelMode === 'tags' && <TagManager />}
        {rightPanelMode === 'timeline' && <Timeline />}
        {rightPanelMode === 'pdf' && <PdfManager />}
      </div>
    </div>
  );
};

export default DragDropMysteryApp;
