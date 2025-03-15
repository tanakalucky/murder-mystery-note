import { Skeleton } from '@/components/ui/skeleton';

const PdfManagerSkeleton = () => {
  return (
    <div className='flex flex-col h-full space-y-4'>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-10 w-48' />

        <div className='flex items-center gap-1'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className='h-8 w-8 rounded-md' />
          ))}
        </div>
      </div>

      <div className='flex-1 border rounded-md overflow-hidden'>
        <div className='h-full flex flex-col items-center justify-center p-8'>
          <Skeleton className='w-full max-w-md h-[500px]' />
          <div className='mt-4 flex justify-center space-x-4'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-8 w-16' />
            <Skeleton className='h-8 w-8 rounded-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfManagerSkeleton;
