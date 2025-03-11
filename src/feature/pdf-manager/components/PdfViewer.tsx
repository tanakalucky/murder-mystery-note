import { usePdfStore } from '@/store/pdf-store';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

const PdfViewer = () => {
  const currentPdf = usePdfStore((state) => state.currentPdf);
  const [numPages, setNumPages] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const updateScrollPosition = usePdfStore((state) => state.updateScrollPosition);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setDocumentLoaded(true);
  };

  useEffect(() => {
    setDocumentLoaded(false);
    setIsLoading(true);
  }, [currentPdf?.id]);

  useEffect(() => {
    if (currentPdf && scrollAreaRef.current && documentLoaded && numPages) {
      // 少し遅延させてPDFのレンダリング完了後にスクロール位置を設定
      const timer = setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = currentPdf.scrollTop;
          setIsLoading(false);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentPdf?.id, documentLoaded, numPages]);

  const handleScroll = () => {
    if (scrollAreaRef.current && currentPdf) {
      const { scrollTop } = scrollAreaRef.current;
      updateScrollPosition(currentPdf.id, { top: scrollTop });
    }
  };

  // スクロールイベントの最適化（スロットリング）
  const throttledScroll = useRef<NodeJS.Timeout | null>(null);
  const handleScrollThrottled = () => {
    if (throttledScroll.current === null) {
      throttledScroll.current = setTimeout(() => {
        handleScroll();
        throttledScroll.current = null;
      }, 500);
    }
  };

  if (!currentPdf)
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <FileText className="h-12 w-12 mb-2 opacity-20" />

        <p>PDFが追加されていません</p>
      </div>
    );

  return (
    <div
      ref={scrollAreaRef}
      className={`overflow-auto h-full w-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      onScroll={handleScrollThrottled}
    >
      <Document file={currentPdf.url} onLoadSuccess={onDocumentLoadSuccess} loading={<></>}>
        {Array.from({ length: numPages || 0 }).map((_, index) => (
          <Page
            key={index}
            className="flex items-center justify-center"
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={currentPdf.scale}
            loading={<></>}
            canvasBackground="#a9a9a9"
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
