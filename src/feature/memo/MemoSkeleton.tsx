import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MemoSkeleton = () => {
  return (
    <div className='flex flex-col h-full space-y-4'>
      <Skeleton className='w-full h-24' />

      <div className='space-y-4 flex-1'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardContent className='p-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-1/2' />
                <div className='flex justify-between items-center mt-2'>
                  <div className='flex space-x-2'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-6 w-16' />
                  </div>
                  <Skeleton className='h-6 w-6 rounded-full' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemoSkeleton;
