/** @format */

import React from 'react';
import { MatchCardSkeleton } from '@/components/custom/afl/MatchCardSkeleton';

export function Loading() {
  return (
    <div className='flex flex-col gap-6 -mt-2'>
      {/* Results Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='h-5 w-48 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
      </div>

      {/* Skeleton Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]'>
        {Array.from({ length: 12 }).map((_, i) => (
          <MatchCardSkeleton key={i} layout={false} />
        ))}
      </div>
    </div>
  );
}
