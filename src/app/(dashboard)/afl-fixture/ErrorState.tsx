/** @format */

import React from 'react';

interface ErrorStateProps {
  error: unknown;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 text-red-500'>
      <div className='rounded-full bg-red-50 p-4 dark:bg-red-500/10'>
        <svg
          className='size-8'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
      <p className='text-center'>
        Failed to load fixture data. <br />
        <span className='text-sm opacity-70'>
          {(error as Error)?.message}
        </span>
      </p>
    </div>
  );
}
