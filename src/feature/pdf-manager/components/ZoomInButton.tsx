import { Button } from '@/components/ui/button';
import { ZOOM_MAX, usePdfStore } from '@/store/pdf-store';
import { ZoomIn } from 'lucide-react';

export const ZoomInButton = () => {
  const currentPdf = usePdfStore((state) => state.currentPdf);
  const zoomIn = usePdfStore((state) => state.zoomIn);

  if (!currentPdf) return null;

  return (
    <Button variant='outline' size='icon' onClick={zoomIn} disabled={currentPdf.scale >= ZOOM_MAX} title='拡大'>
      <ZoomIn className='h-4 w-4' />
    </Button>
  );
};
