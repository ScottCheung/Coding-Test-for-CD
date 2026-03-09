/** @format */

import { ColumnDef } from '@tanstack/react-table';
import type { AflMatch } from '@/types/afl';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const columns: ColumnDef<AflMatch & { roundCode: string }>[] = [
  {
    accessorKey: 'roundCode',
    header: 'Round',
    cell: ({ row }) => (
      <span className='inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary'>
        {row.original.roundCode}
      </span>
    ),
  },
  {
    id: 'teams',
    header: 'Match',
    accessorFn: (row) => {
      const home = row.squads?.home?.name || 'TBD';
      const away = row.squads?.away?.name || 'TBD';
      return `${home} vs ${away}`;
    },
    cell: ({ row }) => {
      const home = row.original.squads?.home;
      const away = row.original.squads?.away;
      return (
        <div className='flex items-center gap-2'>
          <span className='font-bold text-ink-primary'>
            {home?.name || 'TBD'}
          </span>
          <span className='text-xs text-ink-secondary'>vs</span>
          <span className='font-bold text-ink-primary'>
            {away?.name || 'TBD'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'score',
    header: 'Score',
    accessorFn: (row) => {
      const homeScore = row.squads?.home?.score?.points ?? 0;
      const awayScore = row.squads?.away?.score?.points ?? 0;
      return homeScore + awayScore;
    },
    cell: ({ row }) => {
      const home = row.original.squads?.home;
      const away = row.original.squads?.away;
      const isComplete = row.original.status?.code === 'COMP';

      if (!isComplete) {
        return <span className='text-xs text-ink-secondary'>-</span>;
      }

      const homeScore = home?.score?.points ?? 0;
      const awayScore = away?.score?.points ?? 0;
      const homeWin = homeScore > awayScore;
      const awayWin = awayScore > homeScore;

      return (
        <div className='flex items-center gap-2 font-mono text-sm'>
          <span className={cn('font-bold', homeWin && 'text-primary')}>
            {homeScore}
          </span>
          <span className='text-ink-secondary'>-</span>
          <span className={cn('font-bold', awayWin && 'text-primary')}>
            {awayScore}
          </span>
        </div>
      );
    },
  },
  {
    id: 'date',
    header: 'Date & Time',
    accessorFn: (row) => {
      const date = row.date?.utcMatchStart;
      return date ? dayjs(date).valueOf() : 0;
    },
    cell: ({ row }) => {
      const date = row.original.date?.utcMatchStart;
      const venue = row.original.venue;

      if (!date) return <span className='text-xs text-ink-secondary'>TBD</span>;

      const localTime =
        venue?.timeZone ? dayjs(date).tz(venue.timeZone) : dayjs(date);

      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs font-medium text-ink-primary'>
            {localTime.format('ddd D MMM YYYY')}
          </span>
          <span className='text-[10px] text-ink-secondary'>
            {localTime.format('h:mm A z')}
          </span>
        </div>
      );
    },
  },
  {
    id: 'venue',
    header: 'Venue',
    accessorFn: (row) => row.venue?.name || 'TBD',
    cell: ({ row }) => (
      <span className='text-xs text-ink-secondary'>
        {row.original.venue?.name || 'TBD'}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: (row) => row.status?.name || 'Unknown',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusCode = status?.code || '';
      const statusName = status?.name || 'Unknown';

      const statusColors: Record<string, string> = {
        COMP: 'bg-green-500/10 text-green-600 dark:text-green-400',
        LIVE: 'bg-red-500/10 text-red-600 dark:text-red-400',
        SCHD: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      };

      return (
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider',
            statusColors[statusCode] ||
              'bg-gray-500/10 text-gray-600 dark:text-gray-400',
          )}
        >
          {statusName}
        </span>
      );
    },
  },
];
