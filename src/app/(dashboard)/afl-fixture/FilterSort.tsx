/** @format */

import React from 'react';
import { Button } from '@/components/UI/Button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAflFixture } from '@/hooks/useAflFixture';

interface FilterSortProps {
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
}

export function AflFilterSort({
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
}: FilterSortProps) {
  const { allMatches } = useAflFixture();

  const toggleItem = (items: string[], item: string) => {
    return items.includes(item) ?
        items.filter((i) => i !== item)
      : [...items, item];
  };

  const getAvailableOptions = () => {
    let tempMatches = allMatches;

    const availableRounds = new Set<string>();
    const availableVenues = new Set<string>();
    const availableTeams = new Set<string>();

    // For rounds: check what's available given current venue and team filters
    tempMatches = allMatches;
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
