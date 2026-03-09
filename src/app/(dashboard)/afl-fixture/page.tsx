/** @format */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAflFixture } from '@/hooks/useAflFixture';
import { MatchCard } from '@/components/custom/afl/MatchCard';
import { useHeaderStore } from '@/lib/store/header-store';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useSearch } from '@/hooks/use-search';
import { TableToolbar } from '@/components/custom/table-toolbar';
import { Switch } from '@/components/UI/switch';
import {
  usePreferencesStore,
  usePreferencesActions,
} from '@/lib/store/preferences-store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Button } from '@/components/UI/Button';
import { Filter, X } from 'lucide-react';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { MatchCardSkeleton } from '@/components/custom/afl/MatchCardSkeleton';
import { DataTable } from '@/components/UI/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import type { AflMatch } from '@/types/afl';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);

// Define columns for table view
const columns: ColumnDef<AflMatch & { roundCode: string }>[] = [
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

export default function AflFixturePage() {
  const { allMatches, roundCodes, venues, teams, isLoading, isError, error } =
    useAflFixture();

  const viewMode = usePreferencesStore((state) => state.viewMode);
  const { setColumnSettings } = usePreferencesActions();

  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const searchHook = useSearch();
  const {
    value: search,
    onChange,
    debouncedValue: debouncedSearch,
    isDebouncing,
  } = searchHook;

  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'score';
    direction: 'asc' | 'desc';
  } | null>(null);

  const isDrawerOpen = useLayoutStore((state) => state.isDrawerOpen);
  const drawerTitle = useLayoutStore((state) => state.drawerConfig.title);
  const { openDrawer, closeDrawer } = useLayoutStore((state) => state.actions);

  const isFilterOpen = isDrawerOpen && drawerTitle === 'Filter & Sort';
  const isSettingsOpen = isDrawerOpen && drawerTitle === 'View Settings';

  const columnSettings =
    usePreferencesStore((state) => state.columnSettings['afl-fixture']) || {};
  const columnVisibility = columnSettings.visibility || {};
  const columnOrder = columnSettings.order || [];

  // Initialize column order if empty
  useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnSettings('afl-fixture', {
        order: columns.map((c) => c.id as string),
      });
    }
  }, [columnOrder.length, setColumnSettings]);

  // Filter settings interface
  const handleFilterClick = () => {
    if (isFilterOpen) {
      closeDrawer();
      return;
    }

    openDrawer({
      title: 'Filter & Sort',
      width: 400,
      content: (
        <AflFilterSort
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          selectedRounds={selectedRounds}
          setSelectedRounds={setSelectedRounds}
          selectedVenues={selectedVenues}
          setSelectedVenues={setSelectedVenues}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          roundCodes={roundCodes}
          venues={venues}
          teams={teams}
          onClose={closeDrawer}
        />
      ),
    });
  };

  // Update drawer content when filters change
  useEffect(() => {
    if (isFilterOpen) {
      openDrawer({
        title: 'Filter & Sort',
        width: 400,
        content: (
          <AflFilterSort
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            selectedRounds={selectedRounds}
            setSelectedRounds={setSelectedRounds}
            selectedVenues={selectedVenues}
            setSelectedVenues={setSelectedVenues}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            roundCodes={roundCodes}
            venues={venues}
            teams={teams}
            onClose={closeDrawer}
          />
        ),
      });
    }
  }, [selectedRounds, selectedVenues, selectedTeams, sortConfig, isFilterOpen]);

  const handleSettingsClick = () => {
    if (isSettingsOpen) {
      closeDrawer();
      return;
    }
    openDrawer({
      title: 'View Settings',
      width: 400,
      content: <AflViewSettings />,
    });
  };

  // Update header title cleanly
  useEffect(() => {
    const activeFiltersCount =
      selectedRounds.length + selectedVenues.length + selectedTeams.length;

    useHeaderStore.getState().setHeader({
      title: 'AFL Fixture',
      description:
        'View the AFL Premiership Season schedule and match details.',
      children: (
        <TableToolbar
          search={{
            value: search,
            onChange: onChange,
            placeholder: 'Search matches (teams, venues)...',
            isDebouncing,
          }}
          onSettingsClick={handleSettingsClick}
          isSettingsOpen={isSettingsOpen}
        >
          <Button
            variant={isFilterOpen ? 'default' : 'ghost'}
            size='icon'
            className='rounded-full relative'
            onClick={handleFilterClick}
            title='Filter & Sort'
          >
            <Filter className='size-4' />
            {activeFiltersCount > 0 && (
              <span className='absolute -top-1 -right-1 size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm'>
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </TableToolbar>
      ),
    });
  }, [
    search,
    isDebouncing,
    isSettingsOpen,
    isFilterOpen,
    selectedRounds,
    selectedVenues,
    selectedTeams,
    sortConfig,
    columnVisibility,
  ]);

  // Derived filtered matches
  const filteredMatches = useMemo(() => {
    let result = allMatches;

    // Apply search filter first
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((m) => {
        const homeName = m.squads?.home?.name?.toLowerCase() || '';
        const awayName = m.squads?.away?.name?.toLowerCase() || '';
        const venueName = m.venue?.name?.toLowerCase() || '';
        const roundCode = m.roundCode?.toLowerCase() || '';

        return (
          homeName.includes(query) ||
          awayName.includes(query) ||
          venueName.includes(query) ||
          roundCode.includes(query)
        );
      });
    }

    // Apply filter selections
    result = result.filter((m) => {
      const matchRound =
        selectedRounds.length === 0 || selectedRounds.includes(m.roundCode);
      const matchVenue =
        selectedVenues.length === 0 ||
        selectedVenues.includes(m.venue?.name || '');
      const matchTeam =
        selectedTeams.length === 0 ||
        selectedTeams.includes(m.squads?.home?.name || '') ||
        selectedTeams.includes(m.squads?.away?.name || '');
      return matchRound && matchVenue && matchTeam;
    });

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (sortConfig.key === 'date') {
          const tA =
            a.date?.utcMatchStart ? dayjs(a.date.utcMatchStart).valueOf() : 0;
          const tB =
            b.date?.utcMatchStart ? dayjs(b.date.utcMatchStart).valueOf() : 0;
          return sortConfig.direction === 'asc' ? tA - tB : tB - tA;
        } else {
          // Total Score
          const scoreA =
            (a.squads?.home?.score?.points || 0) +
            (a.squads?.away?.score?.points || 0);
          const scoreB =
            (b.squads?.home?.score?.points || 0) +
            (b.squads?.away?.score?.points || 0);
          return sortConfig.direction === 'asc' ?
              scoreA - scoreB
            : scoreB - scoreA;
        }
      });
    }

    return result;
  }, [
    allMatches,
    debouncedSearch,
    selectedRounds,
    selectedVenues,
    selectedTeams,
    sortConfig,
  ]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 -mt-2'>
        {/* Results Header Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='h-5 w-48 bg-black/5 dark:bg-white/5 rounded animate-pulse' />
        </div>

        {/* Skeleton Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]'>
          {Array.from({ length: 12 }).map((_, i) => (
            <MatchCardSkeleton key={i} layout={false} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
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

  return (
    <div className='flex flex-col gap-6 -mt-2'>
      {/* Results Header */}
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium text-ink-secondary'>
          Showing{' '}
          <span className='text-ink-primary font-bold'>
            {filteredMatches.length}
          </span>{' '}
          of {allMatches.length} matches
          {(selectedRounds.length > 0 ||
            selectedVenues.length > 0 ||
            selectedTeams.length > 0) && (
            <span className='ml-2 text-primary'>
              (
              {selectedRounds.length > 0 &&
                `${selectedRounds.length} round${selectedRounds.length > 1 ? 's' : ''}`}
              {selectedRounds.length > 0 &&
                (selectedVenues.length > 0 || selectedTeams.length > 0) &&
                ', '}
              {selectedVenues.length > 0 &&
                `${selectedVenues.length} venue${selectedVenues.length > 1 ? 's' : ''}`}
              {selectedVenues.length > 0 && selectedTeams.length > 0 && ', '}
              {selectedTeams.length > 0 &&
                `${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''}`}
              )
            </span>
          )}
        </p>
        {(selectedRounds.length > 0 ||
          selectedVenues.length > 0 ||
          selectedTeams.length > 0) && (
          <button
            onClick={() => {
              setSelectedRounds([]);
              setSelectedVenues([]);
              setSelectedTeams([]);
            }}
            className='text-xs font-semibold text-primary hover:underline'
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Match Grid */}
      {filteredMatches.length > 0 ?
        viewMode === 'table' ?
          <DataTable
            columns={columns}
            data={filteredMatches}
            hideToolbar={true}
            enableSorting={true}
            enableColumnVisibility={true}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={(updaterOrValue) => {
              const newValue =
                typeof updaterOrValue === 'function' ?
                  updaterOrValue(columnVisibility)
                : updaterOrValue;
              setColumnSettings('afl-fixture', { visibility: newValue });
            }}
            columnOrder={columnOrder}
            onColumnOrderChange={(updaterOrValue) => {
              const newValue =
                typeof updaterOrValue === 'function' ?
                  updaterOrValue(columnOrder)
                : updaterOrValue;
              setColumnSettings('afl-fixture', { order: newValue });
            }}
          />
        : <WaterfallLayout minColumnWidth={350}>
            {filteredMatches.map((match) => {
              const homeScore = match.squads?.home?.score?.points ?? 0;
              const awayScore = match.squads?.away?.score?.points ?? 0;
              const scoreString = `${homeScore}:${awayScore}`;
              const layout = scoreString.length > 5;
              return (
                <MatchCard
                  key={`${match.id || match.roundCode}`}
                  match={match}
                  visibility={columnVisibility}
                  layout={layout}
                />
              );
            })}
          </WaterfallLayout>

      : <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/5 bg-panel p-8 text-center dark:border-white/5'
        >
          <div className='mb-4 rounded-full bg-primary/10 p-3 text-primary'>
            <svg
              className='size-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-bold text-ink-primary'>
            No matches found
          </h3>
          <p className='mt-1 text-sm text-ink-secondary'>
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => {
              setSelectedRounds([]);
              setSelectedVenues([]);
              setSelectedTeams([]);
              onChange('');
            }}
            className='mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95'
          >
            Clear Filters
          </button>
        </motion.div>
      }
    </div>
  );
}

function AflViewSettings() {
  const { setColumnSettings } = usePreferencesActions();
  const { closeDrawer } = useLayoutStore((state) => state.actions);
  const viewMode = usePreferencesStore((state) => state.viewMode);
  const { setViewMode } = usePreferencesActions();

  const columnSettings =
    usePreferencesStore((state) => state.columnSettings['afl-fixture']) || {};
  const columnVisibility = columnSettings.visibility || {};

  const handleToggleVisibility = (key: string, val: boolean) => {
    setColumnSettings('afl-fixture', {
      visibility: { ...columnVisibility, [key]: val },
    });
  };

  return (
    <div className='flex flex-col h-full bg-panel'>
      <div className='flex items-center justify-between p-6 pb-0'>
        <div>
          <h2 className='text-lg font-bold text-primary'>View Settings</h2>
          <p className='text-sm text-ink-secondary'>
            Customize view mode and column visibility.
          </p>
        </div>
        <Button Icon={X} onClick={closeDrawer} variant='ghost' />
      </div>

      <div className='p-6 space-y-6'>
        {/* View Mode Toggle */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-ink-primary'>View Mode</h3>
          <div className='flex gap-2'>
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all',
                viewMode === 'card' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              <LayoutGrid className='size-4' />
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all',
                viewMode === 'table' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              <TableIcon className='size-4' />
              Table
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-ink-primary'>
            Visible Columns
          </h3>
          <div className='space-y-2'>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary opacity-50'>
                Team Names
              </span>
              <Switch
                checked={columnVisibility['name'] !== false}
                disabled
                onCheckedChange={() => {}}
              />
            </div>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary opacity-50'>
                Match Score
              </span>
              <Switch
                checked={columnVisibility['score'] !== false}
                disabled
                onCheckedChange={() => {}}
              />
            </div>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary'>Round Code</span>
              <Switch
                checked={columnVisibility['roundCode'] !== false}
                onCheckedChange={(val) =>
                  handleToggleVisibility('roundCode', val)
                }
              />
            </div>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary'>
                Match Date & Time
              </span>
              <Switch
                checked={columnVisibility['date'] !== false}
                onCheckedChange={(val) => handleToggleVisibility('date', val)}
              />
            </div>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary'>Venue</span>
              <Switch
                checked={columnVisibility['venue'] !== false}
                onCheckedChange={(val) => handleToggleVisibility('venue', val)}
              />
            </div>
            <div className='flex items-center justify-between p-2 text-sm rounded-full bg-background'>
              <span className='font-medium text-ink-primary'>Match Status</span>
              <Switch
                checked={columnVisibility['status'] !== false}
                onCheckedChange={(val) => handleToggleVisibility('status', val)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AflFilterSort({
  sortConfig,
  setSortConfig,
  selectedRounds,
  setSelectedRounds,
  selectedVenues,
  setSelectedVenues,
  selectedTeams,
  setSelectedTeams,
  roundCodes,
  venues,
  teams,
  onClose,
}: {
  sortConfig: { key: 'date' | 'score'; direction: 'asc' | 'desc' } | null;
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: 'date' | 'score';
      direction: 'asc' | 'desc';
    } | null>
  >;
  selectedRounds: string[];
  setSelectedRounds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVenues: string[];
  setSelectedVenues: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTeams: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
  roundCodes: string[];
  venues: string[];
  teams: string[];
  onClose: () => void;
}) {
  const { allMatches } = useAflFixture();

  const toggleItem = (items: string[], item: string) => {
    return items.includes(item) ?
        items.filter((i) => i !== item)
      : [...items, item];
  };

  // Calculate which options would result in matches
  const getAvailableOptions = () => {
    // Get currently filtered matches based on existing selections
    let baseMatches = allMatches;

    // Apply current filters
    if (selectedRounds.length > 0) {
      baseMatches = baseMatches.filter((m) =>
        selectedRounds.includes(m.roundCode),
      );
    }
    if (selectedVenues.length > 0) {
      baseMatches = baseMatches.filter((m) =>
        selectedVenues.includes(m.venue?.name || ''),
      );
    }
    if (selectedTeams.length > 0) {
      baseMatches = baseMatches.filter(
        (m) =>
          selectedTeams.includes(m.squads?.home?.name || '') ||
          selectedTeams.includes(m.squads?.away?.name || ''),
      );
    }

    // Calculate available options for each filter type
    const availableRounds = new Set<string>();
    const availableVenues = new Set<string>();
    const availableTeams = new Set<string>();

    // For rounds: check what's available given current venue and team filters
    let tempMatches = allMatches;
    if (selectedVenues.length > 0) {
      tempMatches = tempMatches.filter((m) =>
        selectedVenues.includes(m.venue?.name || ''),
      );
    }
    if (selectedTeams.length > 0) {
      tempMatches = tempMatches.filter(
        (m) =>
          selectedTeams.includes(m.squads?.home?.name || '') ||
          selectedTeams.includes(m.squads?.away?.name || ''),
      );
    }
    tempMatches.forEach((m) => availableRounds.add(m.roundCode));

    // For venues: check what's available given current round and team filters
    tempMatches = allMatches;
    if (selectedRounds.length > 0) {
      tempMatches = tempMatches.filter((m) =>
        selectedRounds.includes(m.roundCode),
      );
    }
    if (selectedTeams.length > 0) {
      tempMatches = tempMatches.filter(
        (m) =>
          selectedTeams.includes(m.squads?.home?.name || '') ||
          selectedTeams.includes(m.squads?.away?.name || ''),
      );
    }
    tempMatches.forEach(
      (m) => m.venue?.name && availableVenues.add(m.venue.name),
    );

    // For teams: check what's available given current round and venue filters
    tempMatches = allMatches;
    if (selectedRounds.length > 0) {
      tempMatches = tempMatches.filter((m) =>
        selectedRounds.includes(m.roundCode),
      );
    }
    if (selectedVenues.length > 0) {
      tempMatches = tempMatches.filter((m) =>
        selectedVenues.includes(m.venue?.name || ''),
      );
    }
    tempMatches.forEach((m) => {
      m.squads?.home?.name && availableTeams.add(m.squads.home.name);
      m.squads?.away?.name && availableTeams.add(m.squads.away.name);
    });

    return {
      rounds: availableRounds,
      venues: availableVenues,
      teams: availableTeams,
    };
  };

  const availableOptions = getAvailableOptions();

  return (
    <div className='flex flex-col h-full bg-panel'>
      <div className='flex items-center justify-between p-6 pb-0'>
        <div>
          <h2 className='text-lg font-bold text-primary'>Filter & Sort</h2>
          <p className='text-sm text-ink-secondary'>
            Filter matches and sort results.
          </p>
        </div>
        <Button Icon={X} onClick={onClose} variant='ghost' />
      </div>

      <div className='flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar'>
        <div className='flex flex-col gap-4'>
          <h4 className='text-sm font-bold text-ink-primary border-b border-black/5 pb-2 dark:border-white/5'>
            Sort Matches
          </h4>
          <div className='flex gap-2'>
            <button
              onClick={() =>
                setSortConfig((prev) =>
                  prev?.key === 'date' ?
                    {
                      key: 'date',
                      direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    }
                  : { key: 'date', direction: 'asc' },
                )
              }
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-1 text-center',
                sortConfig?.key === 'date' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              Date{' '}
              {sortConfig?.key === 'date' ?
                sortConfig.direction === 'asc' ?
                  '↑'
                : '↓'
              : ''}
            </button>
            <button
              onClick={() =>
                setSortConfig((prev) =>
                  prev?.key === 'score' ?
                    {
                      key: 'score',
                      direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    }
                  : { key: 'score', direction: 'asc' },
                )
              }
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-1 text-center',
                sortConfig?.key === 'score' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              Score{' '}
              {sortConfig?.key === 'score' ?
                sortConfig.direction === 'asc' ?
                  '↑'
                : '↓'
              : ''}
            </button>
          </div>
          {sortConfig && (
            <button
              onClick={() => setSortConfig(null)}
              className='text-[10px] text-ink-secondary hover:underline self-end'
            >
              Reset Sort
            </button>
          )}
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-bold text-ink-primary'>Rounds</h4>
            {selectedRounds.length > 0 && (
              <button
                onClick={() => setSelectedRounds([])}
                className='text-[10px] text-primary hover:underline font-semibold'
              >
                Clear ({selectedRounds.length})
              </button>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {roundCodes.map((round) => {
              const isSelected = selectedRounds.includes(round);
              const isAvailable = availableOptions.rounds.has(round);
              const isDisabled = !isSelected && !isAvailable;

              return (
                <button
                  key={round}
                  onClick={() =>
                    !isDisabled &&
                    setSelectedRounds(toggleItem(selectedRounds, round))
                  }
                  disabled={isDisabled}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full transition-all',
                    isSelected ?
                      'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : isDisabled ?
                      'bg-black/5 text-ink-muted opacity-40 cursor-not-allowed dark:bg-white/5'
                    : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                  )}
                >
                  {round}
                </button>
              );
            })}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-bold text-ink-primary'>Venues</h4>
            {selectedVenues.length > 0 && (
              <button
                onClick={() => setSelectedVenues([])}
                className='text-[10px] text-primary hover:underline font-semibold'
              >
                Clear ({selectedVenues.length})
              </button>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {venues.map((venue) => {
              const isSelected = selectedVenues.includes(venue);
              const isAvailable = availableOptions.venues.has(venue);
              const isDisabled = !isSelected && !isAvailable;

              return (
                <button
                  key={venue}
                  onClick={() =>
                    !isDisabled &&
                    setSelectedVenues(toggleItem(selectedVenues, venue))
                  }
                  disabled={isDisabled}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full transition-all',
                    isSelected ?
                      'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : isDisabled ?
                      'bg-black/5 text-ink-muted opacity-40 cursor-not-allowed dark:bg-white/5'
                    : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                  )}
                >
                  {venue}
                </button>
              );
            })}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-bold text-ink-primary'>Teams</h4>
            {selectedTeams.length > 0 && (
              <button
                onClick={() => setSelectedTeams([])}
                className='text-[10px] text-primary hover:underline font-semibold'
              >
                Clear ({selectedTeams.length})
              </button>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {teams.map((team) => {
              const isSelected = selectedTeams.includes(team);
              const isAvailable = availableOptions.teams.has(team);
              const isDisabled = !isSelected && !isAvailable;

              return (
                <button
                  key={team}
                  onClick={() =>
                    !isDisabled &&
                    setSelectedTeams(toggleItem(selectedTeams, team))
                  }
                  disabled={isDisabled}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full transition-all',
                    isSelected ?
                      'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : isDisabled ?
                      'bg-black/5 text-ink-muted opacity-40 cursor-not-allowed dark:bg-white/5'
                    : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                  )}
                >
                  {team}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
