/** @format */

import React from 'react';

interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  selectedRounds: string[];
  selectedVenues: string[];
  selectedTeams: string[];
  onClearFilters: () => void;
}

export function ResultsHeader({
  filteredCount,
  totalCount,
  selectedRounds,
  selectedVenues,
  selectedTeams,
  onClearFilters,
}: ResultsHeaderProps) {
  const hasFilters =
    selectedRounds.length > 0 ||
    selectedVenues.length > 0 ||
    selectedTeams.length > 0;

  return (
    <div className='flex items-center justify-between'>
      <p className='text-sm font-medium text-ink-secondary'>
        Showing{' '}
        <span className='text-ink-primary font-bold'>{filteredCount}</span> of{' '}
        {totalCount} matches
        {hasFilters && (
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
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className='text-xs font-semibold text-primary hover:underline'
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
