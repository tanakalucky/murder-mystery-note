import { Skeleton } from '@/components/ui/skeleton';

const TagManagerSkeleton = () => {
  return (
    <div className='flex flex-col h-full space-y-4'>
      <div className='flex space-x-2 border-b pb-2'>
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-8 w-24' />
      </div>

      <div className='flex space-x-2'>
        <Skeleton className='h-10 flex-1' />
        <Skeleton className='h-10 w-20' />
      </div>

      <div className='grid grid-cols-2 gap-2 mt-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='flex items-center space-x-2 p-2 border rounded-md'>
            <Skeleton className='h-4 w-4 rounded-full' />
            <Skeleton className='h-4 flex-1' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManagerSkeleton;
