/** @format */

'use client';

import { memo } from 'react';
import type { AflMatch } from '@/types/afl';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { MatchStatusBadge } from './MatchStatusBadge';
import { TeamDisplay } from './TeamDisplay';
import { MatchMetaInfo } from './MatchMetaInfo';

dayjs.extend(utc);
dayjs.extend(timezone);

interface MatchCardProps {
  match: AflMatch & { roundCode: string };
  className?: string;
  visibility?: Record<string, boolean>;
  layout?: boolean;
}

export const MatchCard = memo(function MatchCard({
  match,
  className,
  visibility,
  layout,
}: MatchCardProps) {
  const { squads, date, venue, status } = match;
  const home = squads?.home;
  const away = squads?.away;
  const isComplete = status?.code === 'COMP';
  const homeScorePoints = home?.score?.points ?? 0;
  const awayScorePoints = away?.score?.points ?? 0;
  const homeWin =
    isComplete && home && away && homeScorePoints > awayScorePoints;
  const awayWin =
    isComplete && home && away && awayScorePoints > homeScorePoints;

  // Time handling
  let localTime = null;
  if (date?.utcMatchStart) {
    localTime = dayjs(date.utcMatchStart);
    if (venue?.timeZone) {
      try {
        // iOS Safari and other mobile browsers might throw RangeError if timezone string is unsupported
        localTime = dayjs(date.utcMatchStart).tz(venue.timeZone);
      } catch (e) {
        console.warn(
          'Unsupported timezone string on this browser:',
          venue.timeZone,
        );
        localTime = dayjs(date.utcMatchStart);
      }
    }
  }

  const formattedDate = localTime ? localTime.format('ddd D MMM YYYY') : null;
  const formattedTime = localTime ? localTime.format('h:mm A z') : null;

  // Check if match details are incomplete
  const isTBD = !home || !away || !localTime;
  const hasVenue = venue?.name && venue.name.trim() !== '';

  // Visibility logic
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
        roundCode={match.roundCode}
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
