/** @format */

'use client';

import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface MatchMetaInfoProps {
  showDate: boolean;
  formattedDate: string;
  formattedTime: string;
  showVenue: boolean;
  venueName: string;
}

export function MatchMetaInfo({
  showDate,
  formattedDate,
  formattedTime,
  showVenue,
  venueName,
}: MatchMetaInfoProps) {
  if (!showDate && !showVenue) return null;

  return (
    <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/5 pt-4 dark:border-white/5'>
      {showDate && (
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center '>
            <Clock className='size-3 text-ink-secondary/70' />
          </div>
          <span className='text-[10px] font-bold text-ink-secondary'>
            {formattedDate} · <span className='opacity-60'>{formattedTime}</span>
          </span>
        </div>
      )}
      {showVenue && (
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center '>
            <MapPin className='size-3 text-ink-secondary/70' />
          </div>
          <span className='text-[10px] font-bold text-ink-secondary line-clamp-1'>
            {venueName || 'Unknown Venue'}
          </span>
        </div>
      )}
    </div>
  );
}
