/** @format */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Clock, ArrowRightCircle } from 'lucide-react';

interface MatchStatusBadgeProps {
  statusName: string;
  statusCode: string;
  showStatus: boolean;
  roundCode: string;
  showRoundCode: boolean;
}

export function MatchStatusBadge({
  statusName,
  statusCode,
  showStatus,
  roundCode,
  showRoundCode,
}: MatchStatusBadgeProps) {
  const isComplete = statusCode === 'COMP';

  return (
    <div className='flex items-center justify-between mb-4'>
      {showStatus ? (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
            isComplete
              ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400'
              : 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
          )}
        >
          {isComplete ? (
            <ArrowRightCircle className='size-3 stroke-[2.5px]' />
          ) : (
            <Clock className='size-3 stroke-[2.5px]' />
          )}
          {statusName || 'Unknown'}
        </span>
      ) : (
        <div />
      )}
      {showRoundCode && (
        <span className='rounded-md bg-black/5 px-2 py-1 text-[10px] font-bold text-ink-secondary dark:bg-white/5'>
          {roundCode}
        </span>
      )}
    </div>
  );
}
