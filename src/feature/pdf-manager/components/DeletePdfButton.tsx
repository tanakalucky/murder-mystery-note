import { Button } from '@/components/ui/button';
import { usePdfStore } from '@/store/pdf-store';
import { Trash2 } from 'lucide-react';

export const DeletePdfButton = () => {
  const currentPdf = usePdfStore((state) => state.currentPdf);
  const removePdf = usePdfStore((state) => state.removePdf);

  if (!currentPdf) return null;

  return (
    <Button variant='outline' size='icon' onClick={() => removePdf(currentPdf.id)} className=' text-red-500'>
      <Trash2 className='h-4 w-4' />
    </Button>
  );
};
