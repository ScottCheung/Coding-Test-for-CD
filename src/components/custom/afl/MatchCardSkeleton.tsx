/** @format */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MatchCardSkeletonProps {
  className?: string;
  layout?: boolean;
}

export function MatchCardSkeleton({
  className,
  layout,
}: MatchCardSkeletonProps) {
  return (
    <article
      className={cn(
        'relative flex flex-col overflow-hidden rounded-card bg-panel p-card border border-transparent',
        className,
      )}
    >
      {/* Status Badge Skeleton - matches MatchStatusBadge */}
      <div className='flex items-center justify-between mb-4'>
        <div className='inline-flex items-center gap-1.5 rounded-full px-2.5 py-1'>
          <div className='size-3 bg-black/5 dark:bg-white/5 rounded-full animate-pulse' />
          <div className='h-3 w-16 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
        </div>
        <div className='rounded-md bg-black/5 px-2 py-1 dark:bg-white/5'>
          <div className='h-3 w-12 bg-black/10 dark:bg-white/10 rounded animate-pulse' />
        </div>
      </div>

      <div
        className={cn(
          'flex items-center justify-between',
          layout ? 'flex-col gap-6 pt-2' : 'gap-4',
        )}
      >
        {/* Home Team Skeleton - matches TeamDisplay */}
        <div
          className={cn(
            'flex flex-1 items-center transition-all duration-300',
            layout ? 'flex-col gap-3' : 'gap-4 text-left',
          )}
        >
          <div className='relative flex flex-col items-center group'>
            <div
              className={cn(
                'relative bg-black/5 dark:bg-white/5 rounded-full animate-pulse',
                layout ? 'size-16' : 'size-14 sm:size-16',
              )}
            />
            {/* Team name skeleton */}
            <div className='mt-2 max-w-[80px] sm:max-w-[100px]'>
              <div className='h-3 w-16 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
            </div>
          </div>

          {/* Score skeleton */}
          <div
            className={cn(
              'flex flex-col-reverse',
              layout ? 'items-center' : 'items-start',
            )}
          >
            <div className='h-8 w-12 bg-black/5 dark:bg-white/5 rounded animate-pulse sm:h-9' />
            <div className='h-2.5 w-8 bg-black/5 dark:bg-white/5 rounded animate-pulse mt-1' />
          </div>
        </div>

        {/* VS Divider */}
        <div
          className={cn(
            'flex flex-col items-center justify-center opacity-30',
            layout ?
              'mx-0 h-px w-full bg-black/10 dark:bg-white/10 my-1'
            : 'mx-1',
          )}
        >
          {!layout && (
            <span className='text-[10px] font-black italic tracking-widest text-ink-secondary'>
              VS
            </span>
          )}
        </div>

        {/* Away Team Skeleton - matches TeamDisplay */}
        <div
          className={cn(
            'flex flex-1 items-center transition-all duration-300',
            layout ? 'flex-col gap-3' : 'gap-4 flex-row-reverse text-right',
          )}
        >
          <div className='relative flex flex-col items-center group'>
            <div
              className={cn(
                'relative bg-black/5 dark:bg-white/5 rounded-full animate-pulse',
                layout ? 'size-16' : 'size-14 sm:size-16',
              )}
            />
            {/* Team name skeleton */}
            <div className='mt-2 max-w-[80px] sm:max-w-[100px]'>
              <div className='h-3 w-16 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
            </div>
          </div>

          {/* Score skeleton */}
          <div
            className={cn(
              'flex flex-col-reverse',
              layout ? 'items-center' : 'items-end',
            )}
          >
            <div className='h-8 w-12 bg-black/5 dark:bg-white/5 rounded animate-pulse sm:h-9' />
            <div className='h-2.5 w-8 bg-black/5 dark:bg-white/5 rounded animate-pulse mt-1' />
          </div>
        </div>
      </div>

      {/* Meta Info Skeleton - matches MatchMetaInfo */}
      <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/5 pt-4 dark:border-white/5'>
        <div className='flex items-center gap-2'>
          <div className='size-3 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
          <div className='h-3 w-32 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-3 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
          <div className='h-3 w-24 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
        </div>
      </div>
    </article>
  );
}
