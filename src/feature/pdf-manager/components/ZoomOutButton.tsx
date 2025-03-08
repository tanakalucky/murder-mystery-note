import { Button } from '@/components/ui/button';
import { ZOOM_MIN, usePdfStore } from '@/store/pdf-store';
import { ZoomOut } from 'lucide-react';

export const ZoomOutButton = () => {
  const currentPdf = usePdfStore((state) => state.currentPdf);
  const zoomOut = usePdfStore((state) => state.zoomOut);

  if (!currentPdf) return null;

  return (
    <Button variant="outline" size="icon" onClick={zoomOut} disabled={currentPdf.scale <= ZOOM_MIN} title="縮小">
      <ZoomOut className="h-4 w-4" />
    </Button>
  );
};
