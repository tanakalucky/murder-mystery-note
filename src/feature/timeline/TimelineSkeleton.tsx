import { Skeleton } from '@/components/ui/skeleton';

const TimelineSkeleton = () => {
  return (
    <div className="flex flex-col h-full space-y-6">
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="ml-8 space-y-4 border-l pl-6 pt-2">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="relative">
                <Skeleton className="absolute -left-10 h-4 w-4 rounded-full" />

                <div className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-2 mt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineSkeleton;
