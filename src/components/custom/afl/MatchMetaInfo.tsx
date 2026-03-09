/** @format */

'use client';

import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface MatchMetaInfoProps {
  showDate: boolean;
  formattedDate: string | null;
  formattedTime: string | null;
  showVenue: boolean;
  venueName: string | null;
  isTBD?: boolean;
}

export function MatchMetaInfo({
  showDate,
  formattedDate,
  formattedTime,
  showVenue,
  venueName,
  isTBD = false,
}: MatchMetaInfoProps) {
  const hasDate = formattedDate && formattedTime;
  const hasVenue = venueName && venueName.trim() !== '';

  if (!showDate && !showVenue) return null;
  if (!hasDate && !hasVenue) return null;

  return (
    <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/5 pt-4 dark:border-white/5'>
      {showDate && (
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center'>
            <Clock className='size-3 text-ink-secondary/70' />
          </div>
          {hasDate ?
            <span className='text-[10px] font-bold text-ink-secondary'>
              {formattedDate} · <span className='opacity-60'>{formattedTime}</span>
            </span>
          : <span className='text-[10px] font-bold text-ink-secondary/50 italic'>
              时间待定
            </span>
          }
        </div>
      )}
      {showVenue && (
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center'>
            <MapPin className='size-3 text-ink-secondary/70' />
          </div>
          {hasVenue ?
            <span className='text-[10px] font-bold text-ink-secondary line-clamp-1'>
              {venueName}
            </span>
          : <span className='text-[10px] font-bold text-ink-secondary/50 italic'>
              场地待定
            </span>
          }
        </div>
      )}
    </div>
  );
}
