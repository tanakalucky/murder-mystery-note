import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('animate-pulse rounded-md bg-muted/50', className)} {...props} />;
};

export { Skeleton };
