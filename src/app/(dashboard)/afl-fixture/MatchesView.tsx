/** @format */

import React from 'react';
import { DataTable } from '@/components/UI/table/data-table';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { MatchCard } from '@/components/custom/afl/MatchCard';
import { columns } from './columns';
import type { AflMatch } from '@/types/afl';
import { usePreferencesActions } from '@/lib/store/preferences-store';

interface MatchesViewProps {
  viewMode: 'card' | 'table';
  matches: AflMatch[];
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
}

export function MatchesView({
  viewMode,
  matches,
  columnVisibility,
  columnOrder,
}: MatchesViewProps) {
  const { setColumnSettings } = usePreferencesActions();

  if (viewMode === 'table') {
    return (
      <DataTable
        columns={columns}
        data={matches}
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
    );
  }

  return (
    <WaterfallLayout minColumnWidth={350}>
      {matches.map((match) => {
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
  );
}
