/** @format */

'use client';

import React from 'react';
import { Card } from '@/components/UI/card';
import { H2 } from '@/components/UI/text/typography';

interface StatusSummaryCardProps {
  completedMatches: number;
  scheduledMatches: number;
  liveMatches: number;
}

export function StatusSummaryCard({
  completedMatches,
  scheduledMatches,
  liveMatches,
}: StatusSummaryCardProps) {
  return (
    <Card className='p-4 sm:p-6'>
      <H2 className='mb-4 text-primary'>Status Summary</H2>
      <div className='space-y-3'>
        <div className='flex items-center justify-between rounded-lg bg-green-500/10 p-2 sm:p-3'>
          <span className='text-xs sm:text-sm font-medium text-green-600 dark:text-green-400'>
            Completed
          </span>
          <span className='text-lg sm:text-xl font-bold text-green-600 dark:text-green-400'>
            {completedMatches}
          </span>
        </div>
        <div className='flex items-center justify-between rounded-lg bg-blue-500/10 p-2 sm:p-3'>
          <span className='text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400'>
            Scheduled
          </span>
          <span className='text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400'>
            {scheduledMatches}
          </span>
        </div>
        {liveMatches > 0 && (
          <div className='flex items-center justify-between rounded-lg bg-red-500/10 p-2 sm:p-3'>
            <span className='text-xs sm:text-sm font-medium text-red-600 dark:text-red-400'>
              Live Now
            </span>
            <span className='text-lg sm:text-xl font-bold text-red-600 dark:text-red-400'>
              {liveMatches}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
