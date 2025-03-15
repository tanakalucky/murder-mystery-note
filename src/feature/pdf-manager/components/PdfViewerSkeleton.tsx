import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';

const PdfViewerSkeleton = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <FileText className='h-12 w-12 mb-2 opacity-20' />
      <Skeleton className='w-full max-w-md h-[500px]' />
    </div>
  );
};

export default PdfViewerSkeleton;
