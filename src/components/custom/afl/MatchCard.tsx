/** @format */

'use client';

import { memo } from 'react';
import type { AflMatch } from '@/types/afl';
import { cn } from '@/lib/utils';

import { MatchStatusBadge } from './MatchStatusBadge';
import { TeamDisplay } from './TeamDisplay';
import { MatchMetaInfo } from './MatchMetaInfo';

interface MatchCardProps {
  match: AflMatch & { roundCode: string };
  className?: string;
  visibility?: Record<string, boolean>;
  layout?: boolean;
}

// 简化的时间格式化函数，避免使用 dayjs 插件
function formatDateTime(utcString: string, timeZone?: string) {
  try {
    const date = new Date(utcString);
    if (isNaN(date.getTime())) {
      return { formattedDate: null, formattedTime: null };
    }

    // 使用原生 Intl API，更安全且兼容性更好
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: timeZone || undefined,
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: timeZone || undefined,
    };

    const formattedDate = new Intl.DateTimeFormat('en-AU', dateOptions).format(
      date,
    );
    const formattedTime = new Intl.DateTimeFormat('en-AU', timeOptions).format(
      date,
    );

    return { formattedDate, formattedTime };
  } catch (error) {
    console.warn('Error formatting date:', error);
    return { formattedDate: null, formattedTime: null };
  }
}

export const MatchCard = memo(function MatchCard({
  match,
  className,
  visibility,
  layout,
}: MatchCardProps) {
  // Safely extract match data with fallbacks
  const squads = match?.squads;
  const date = match?.date;
  const venue = match?.venue;
  const status = match?.status;

  const home = squads?.home;
  const away = squads?.away;
  const isComplete = status?.code === 'COMP';
  const homeScorePoints =
    typeof home?.score?.points === 'number' ? home.score.points : 0;
  const awayScorePoints =
    typeof away?.score?.points === 'number' ? away.score.points : 0;
  const homeWin =
    isComplete && home && away && homeScorePoints > awayScorePoints;
  const awayWin =
    isComplete && home && away && awayScorePoints > homeScorePoints;

  // Time handling with native API - 更安全，不会导致移动端崩溃
  let formattedDate = null;
  let formattedTime = null;
  let localTime = null;

  if (date?.utcMatchStart) {
    const result = formatDateTime(date.utcMatchStart, venue?.timeZone);
    formattedDate = result.formattedDate;
    formattedTime = result.formattedTime;
    localTime = result.formattedDate ? new Date(date.utcMatchStart) : null;
  }

  // Check if match details are incomplete
  const isTBD = !home || !away || !localTime;
  const hasVenue = Boolean(
    venue?.name && typeof venue.name === 'string' && venue.name.trim() !== '',
  );

  // Visibility logic with safe defaults
  const vis = visibility || {};
  const showName = vis.name !== false;
  const showScore = vis.score !== false;
  const showRoundCode = vis.roundCode !== false;
  const showDate = vis.date !== false;
  const showVenue = vis.venue !== false;
  const showStatus = vis.status !== false;

  return (
    <article
      suppressHydrationWarning
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-card bg-panel p-card transition-all duration-500 border border-transparent hover:border-primary/50 hover:-translate-y-1.5',
        isTBD && ' border-dashed border-ink-secondary/20',
        className,
      )}
    >
      <MatchStatusBadge
        statusName={status?.name || ''}
        statusCode={status?.code || ''}
        showStatus={showStatus}
        roundCode={match?.roundCode || ''}
        showRoundCode={showRoundCode}
      />

      {/* {isTBD && (
        <div className='mb-3 flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1.5 border border-amber-500/20'>
          <span className='text-[10px] font-bold text-amber-600 dark:text-amber-400'>
            To Be Decision
          </span>
        </div>
      )} */}

      <div
        className={cn(
          'flex items-center justify-between',
          layout ? 'flex-col gap-6 pt-2' : 'gap-4',
        )}
      >
        {home ?
          <TeamDisplay
            code={home.code}
            name={home.name}
            score={home.score}
            isWinner={homeWin}
            showName={showName}
            showScore={showScore}
            isComplete={isComplete}
            align={layout ? 'center' : 'left'}
            layout={layout}
          />
        : <div
            className={cn(
              'flex flex-1 items-center justify-start',
              layout ? 'flex-col gap-3' : 'gap-4',
            )}
          >
            <div className='flex flex-col items-center gap-2'>
              <div className='size-14 sm:size-16 rounded-full border-2 border-dashed border-ink-secondary/30 flex items-center justify-center'>
                <span className='text-xs font-bold text-ink-secondary/50'>
                  TBD
                </span>
              </div>
              {showName && (
                <span className='text-[10px] font-bold text-ink-secondary/50'>
                  TBD
                </span>
              )}
            </div>
          </div>
        }

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

        {away ?
          <TeamDisplay
            code={away.code}
            name={away.name}
            score={away.score}
            isWinner={awayWin}
            showName={showName}
            showScore={showScore}
            isComplete={isComplete}
            align={layout ? 'center' : 'right'}
            layout={layout}
          />
        : <div
            className={cn(
              'flex flex-1 items-center justify-end',
              layout ? 'flex-col gap-3' : 'gap-4',
            )}
          >
            <div className='flex flex-col items-center gap-2'>
              <div className='size-14 sm:size-16 rounded-full border-2 border-dashed border-ink-secondary/30 flex items-center justify-center'>
                <span className='text-xs font-bold text-ink-secondary/50'>
                  TBD
                </span>
              </div>
              {showName && (
                <span className='text-[10px] font-bold text-ink-secondary/50'>
                  TBD
                </span>
              )}
            </div>
          </div>
        }
      </div>

      <MatchMetaInfo
        showDate={showDate}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        showVenue={showVenue}
        venueName={hasVenue ? venue.name : null}
        isTBD={isTBD}
      />
    </article>
  );
});
