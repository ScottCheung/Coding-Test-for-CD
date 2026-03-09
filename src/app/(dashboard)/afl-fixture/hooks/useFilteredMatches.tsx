/** @format */

import { useMemo } from 'react';
import type { AflMatch } from '@/types/afl';
import dayjs from 'dayjs';

interface UseFilteredMatchesProps {
  allMatches: AflMatch[];
  debouncedSearch: string;
  selectedRounds: string[];
  selectedVenues: string[];
  selectedTeams: string[];
  sortConfig: { key: 'date' | 'score'; direction: 'asc' | 'desc' } | null;
}

export function useFilteredMatches({
  allMatches,
  debouncedSearch,
  selectedRounds,
  selectedVenues,
  selectedTeams,
  sortConfig,
}: UseFilteredMatchesProps) {
  return useMemo(() => {
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
}
