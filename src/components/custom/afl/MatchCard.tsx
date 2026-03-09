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
  const homeWin =
    isComplete && home && away && home.score.points > away.score.points;
  const awayWin =
    isComplete && home && away && away.score.points > home.score.points;

  // Time handling
  const localTime =
    date?.utcMatchStart ?
      venue?.timeZone ?
        dayjs(date.utcMatchStart).tz(venue.timeZone)
      : dayjs(date.utcMatchStart)
    : null;

  const formattedDate =
    localTime ? localTime.format('ddd D MMM YYYY') : 'Date TBD';
  const formattedTime = localTime ? localTime.format('h:mm A z') : 'Time TBD';

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
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-card bg-panel p-card transition-all duration-500 border border-transparent hover:border-primary/50 hover:-translate-y-1.5  ',
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

      <div
        className={cn(
          'flex items-center justify-between',
          layout ? 'flex-col gap-6 pt-2' : 'gap-4',
        )}
      >
        {home && (
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
        )}

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

        {away && (
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
        )}
      </div>

      <MatchMetaInfo
        showDate={showDate}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        showVenue={showVenue}
        venueName={venue?.name || ''}
      />

      {/* Premium glass accent */}
      {/* <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary/40 blur-[1px] transition-transform duration-700 group-hover:scale-x-100' /> */}
    </article>
  );
});
