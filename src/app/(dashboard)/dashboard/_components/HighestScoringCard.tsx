/** @format */

'use client';

import React from 'react';
import { Card } from '@/components/UI/card';
import { H2 } from '@/components/UI/text/typography';

interface HighestScoringCardProps {
  match: {
    squads?: {
      home?: { name?: string; score?: { points?: number } };
      away?: { name?: string; score?: { points?: number } };
    };
    roundCode?: string;
    venue?: { name?: string };
  };
}

export function HighestScoringCard({ match }: HighestScoringCardProps) {
  if (!match.squads) return null;

  return (
    <Card className='p-4 sm:p-6'>
      <H2 className='mb-4 text-primary'>Highest Scoring</H2>
      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-xs sm:text-sm font-bold text-ink-secondary truncate'>
            {match.squads.home?.name}
          </span>
          <span className='text-xl sm:text-2xl font-bold text-primary shrink-0'>
            {match.squads.home?.score?.points || 0}
          </span>
        </div>
        <div className='h-px bg-black/5 dark:bg-white/5' />
        <div className='flex items-center justify-between gap-2'>
          <span className='text-xs sm:text-sm font-bold text-ink-secondary truncate'>
            {match.squads.away?.name}
          </span>
          <span className='text-xl sm:text-2xl font-bold text-primary shrink-0'>
            {match.squads.away?.score?.points || 0}
          </span>
        </div>
        <div className='mt-4 rounded-lg bg-primary/5 p-3'>
          <p className='text-[10px] sm:text-xs text-ink-secondary break-words'>
            {match.roundCode} • {match.venue?.name}
          </p>
        </div>
      </div>
    </Card>
  );
}
