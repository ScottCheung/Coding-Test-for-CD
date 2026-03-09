/** @format */

'use client';

import React, { useState, useEffect } from 'react';
import { useAflFixture } from '@/hooks/useAflFixture';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useSearch } from '@/hooks/use-search';
import {
  usePreferencesStore,
  usePreferencesActions,
} from '@/lib/store/preferences-store';
import { columns } from './_component/columns';
import { AflFilterSort } from './_component/FilterSort';
import { AflViewSettings } from './_component/ViewSettings';
import { ResultsHeader } from './_component/ResultsHeader';
import { EmptyState } from './_component/EmptyState';
import { LoadingState } from './_component/LoadingState';
import { ErrorState } from './_component/ErrorState';
import { MatchesView } from './_component/MatchesView';
import { useFilteredMatches } from './hooks/useFilteredMatches';
import { useFixtureHeader } from './hooks/useFixtureHeader';

export default function AflFixturePage() {
  const { allMatches, roundCodes, venues, teams, isLoading, isError, error } =
    useAflFixture();
  const viewMode = usePreferencesStore((state) => state.viewMode);
  const { setColumnSettings } = usePreferencesActions();

  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'score';
    direction: 'asc' | 'desc';
  } | null>(null);

  const searchHook = useSearch();
  const {
    value: search,
    onChange,
    debouncedValue: debouncedSearch,
    isDebouncing,
  } = searchHook;

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

  const activeFiltersCount =
    selectedRounds.length + selectedVenues.length + selectedTeams.length;

  // Update header
  useFixtureHeader({
    search,
    onChange,
    isDebouncing,
    isSettingsOpen,
    isFilterOpen,
    activeFiltersCount,
    onSettingsClick: handleSettingsClick,
    onFilterClick: handleFilterClick,
  });

  // Get filtered matches
  const filteredMatches = useFilteredMatches({
    allMatches,
    debouncedSearch,
    selectedRounds,
    selectedVenues,
    selectedTeams,
    sortConfig,
  });

  const handleClearFilters = () => {
    setSelectedRounds([]);
    setSelectedVenues([]);
    setSelectedTeams([]);
    onChange('');
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isError) {
    return <ErrorState error={error} />;
  }

  return (
    <div className='flex flex-col gap-6 -mt-2'>
      <ResultsHeader
        filteredCount={filteredMatches.length}
        totalCount={allMatches.length}
        selectedRounds={selectedRounds}
        selectedVenues={selectedVenues}
        selectedTeams={selectedTeams}
        onClearFilters={handleClearFilters}
      />

      {filteredMatches.length > 0 ?
        <MatchesView
          viewMode={viewMode === 'chart' ? 'card' : viewMode}
          matches={filteredMatches}
          columnVisibility={columnVisibility}
          columnOrder={columnOrder}
        />
      : <EmptyState onClearFilters={handleClearFilters} />}
    </div>
  );
}
