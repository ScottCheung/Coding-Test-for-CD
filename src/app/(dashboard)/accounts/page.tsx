/** @format */

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useHeader } from '@/hooks/use-header';
import { useSearch } from '@/hooks/use-search';
import { TableToolbar } from '@/components/custom/table-toolbar';
import {
  usePreferencesStore,
  usePreferencesActions,
} from '@/lib/store/preferences-store';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { DataTable } from '@/components/UI/table/data-table';
import { ColumnSettingsDialog } from '@/components/UI/table/column-settings';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useHeaderStore } from '@/lib/store/header-store';
import { notify } from '@/lib/notifications';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/UI/Button';
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Icon,
  MoveRight,
  X,
} from 'lucide-react';
import teamsData from './teams.json'; // Importing local JSON data
import CardWithNorth from '@/components/UI/card/CardWithNorth';
import { IconBox } from '@/components/UI/icon/box';

type Team = {
  code: string;
  name: string;
  description: string;
  website: string;
};

function TeamLogo({ code, name }: { code: string; name: string }) {
  return (
    <Image
      src={`https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/${code}.svg`}
      alt={`${name} logo`}
      width={150}
      height={150}
      className='relative z-10 drop-shadow-xl shadow-primary group-hover:animate-bounce-subtle transition-transform'
    />
  );
}

const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'code',
    header: 'Logo & Code',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <TeamLogo code={row.original.code} name={row.original.name} />
        <span className='inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary'>
          {row.original.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className='font-bold text-ink-primary'>{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span
        className='text-xs text-ink-secondary line-clamp-2'
        title={row.getValue('description')}
      >
        {row.getValue('description')}
      </span>
    ),
  },
];

export default function TeamsPage() {
  const viewMode = usePreferencesStore((state) => state.viewMode);

  const searchHook = useSearch();
  const {
    value: search,
    onChange,
    debouncedValue: debouncedSearch,
    isDebouncing,
  } = searchHook;

  const [sortConfig, setSortConfig] = React.useState<{
    key: 'name' | 'code';
    direction: 'asc' | 'desc';
  } | null>(null);

  const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);

  const { setColumnSettings } = usePreferencesActions();
  const columnSettings = usePreferencesStore(
    (state) => state.columnSettings['teams'],
  );
  const columnVisibility = columnSettings?.visibility || {};
  const columnOrder = columnSettings?.order || [];

  const {
    actions: { openDrawer, closeDrawer },
    isDrawerOpen,
  } = useLayoutStore();

  React.useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnSettings('teams', {
        order: columns.map((c) => (c.id || (c as any).accessorKey) as string),
      });
    }
  }, [columnOrder.length, setColumnSettings]);

  const isSettingsOpen =
    isDrawerOpen &&
    useLayoutStore.getState().drawerConfig.title === 'View Settings';

  const handleSettingsClick = () => {
    if (isSettingsOpen) {
      notify.info('View settings closed');
      closeDrawer();
      return;
    }

    notify.info('View settings opened');
    openDrawer({
      title: 'View Settings',
      width: 400,
      content: (
        <ColumnSettingsDialog
          columns={columns}
          columnOrder={columnOrder}
          setColumnOrder={(order) => setColumnSettings('teams', { order })}
          columnVisibility={columnVisibility}
          setColumnVisibility={(updaterOrValue) => {
            const newValue =
              typeof updaterOrValue === 'function' ?
                (updaterOrValue as (prev: any) => any)(columnVisibility)
              : updaterOrValue;
            setColumnSettings('teams', { visibility: newValue });
          }}
          onClose={() => {
            notify.info('View settings closed');
            closeDrawer();
          }}
        />
      ),
    });
  };

  const isFilterOpen =
    isDrawerOpen &&
    useLayoutStore.getState().drawerConfig.title === 'Filter & Sort';

  const handleFilterClick = React.useCallback(() => {
    if (isFilterOpen) {
      closeDrawer();
      return;
    }

    openDrawer({
      title: 'Filter & Sort',
      width: 400,
      content: (
        <TeamsFilterSort
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          onClose={closeDrawer}
        />
      ),
    });
  }, [isFilterOpen, sortConfig, selectedTeams, closeDrawer, openDrawer]);

  // Update drawer content when selectedTeams or sortConfig changes
  React.useEffect(() => {
    if (isFilterOpen) {
      openDrawer({
        title: 'Filter & Sort',
        width: 400,
        content: (
          <TeamsFilterSort
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            onClose={closeDrawer}
          />
        ),
      });
    }
  }, [selectedTeams, sortConfig, isFilterOpen]);

  // Update header cleanly to avoid input focus loss
  React.useEffect(() => {
    const activeFiltersCount = selectedTeams.length;

    useHeaderStore.getState().setHeader({
      title: 'AFL Teams',
      description:
        'Explore the 18 clubs competing in the elite AFL Premiership Season.',
      children: (
        <TableToolbar
          search={{
            value: search,
            onChange: onChange,
            placeholder: 'Search teams...',
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
    viewMode,
    sortConfig,
    selectedTeams,
  ]);

  const filteredTeams = useMemo(() => {
    let result = teamsData;

    // Apply team filter
    if (selectedTeams.length > 0) {
      result = result.filter((team) => selectedTeams.includes(team.code));
    }

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.code.toLowerCase().includes(query) ||
          team.description.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [debouncedSearch, sortConfig, selectedTeams]);

  return (
    <div className='flex flex-col gap-6 mt-4'>
      {/* Results Header */}
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium text-ink-secondary'>
          Showing{' '}
          <span className='text-ink-primary font-bold'>
            {filteredTeams.length}
          </span>{' '}
          of {teamsData.length} teams
          {selectedTeams.length > 0 && (
            <span className='ml-2 text-primary'>
              (filtered by {selectedTeams.length} team
              {selectedTeams.length > 1 ? 's' : ''})
            </span>
          )}
        </p>
        {selectedTeams.length > 0 && (
          <button
            onClick={() => setSelectedTeams([])}
            className='text-xs font-semibold text-primary hover:underline'
          >
            Clear Filters
          </button>
        )}
      </div>

      {
        viewMode === 'table' ?
          <DataTable
            columns={columns}
            data={filteredTeams}
            hideToolbar={true}
            enableSorting={true}
            enableColumnVisibility={true}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={(updaterOrValue) => {
              const newValue =
                typeof updaterOrValue === 'function' ?
                  updaterOrValue(columnVisibility)
                : updaterOrValue;
              setColumnSettings('teams', { visibility: newValue });
            }}
            columnOrder={columnOrder}
            onColumnOrderChange={(updaterOrValue) => {
              const newValue =
                typeof updaterOrValue === 'function' ?
                  updaterOrValue(columnOrder)
                : updaterOrValue;
              setColumnSettings('teams', { order: newValue });
            }}
          />
          // Grid/Waterfall view
        : <WaterfallLayout gap={30}>
            {filteredTeams.map((team) => (
              <a
                key={team.code}
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02]"
              >
                <CardWithNorth
                  title={columnVisibility['name'] !== false ? team.name : null}
                >
                  <div className='relative flex items-center h-full gap-2 overflow-visible'>
                    <p
                      className={cn(
                        'text-xs text-ink-secondary line-clamp-4 text-left invisible h-0',
                        columnVisibility['description'] !== false &&
                          'visible h-full',
                      )}
                    >
                      {team.description}
                    </p>
                    <div className=' flex flex-col items-center h-full gap-3 overflow-visible'>
                      {columnVisibility['code'] !== false && (
                        <div
                          className={cn(
                            'relative block ',
                            columnVisibility['description'] !== false ?
                              '-mt-[60px] md:-mt-[100px] lg:-mt-[100px]  w-[70px]'
                            : '-mt-[60px] md:-mt-[70px] lg:-mt-[70px] w-[80px]',
                          )}
                        >
                          <TeamLogo code={team.code} name={team.name} />
                        </div>
                      )}
                      {columnVisibility['code'] !== false && (
                        <span className='inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary'>
                          {team.code}
                        </span>
                      )}
                    </div>
                  </div>
                  <IconBox className='absolute opacity-0 group-hover:opacity-100 right-5 bottom-5'>
                    <ChevronRight size={17} />
                  </IconBox>
                </CardWithNorth>
              </a>
            ))}
            {filteredTeams.length === 0 && (
              <p className='text-center text-sm text-ink-secondary col-span-full py-10'>
                No teams found for "{search}"
              </p>
            )}
          </WaterfallLayout>

      }
    </div>
  );
}

function TeamsFilterSort({
  sortConfig,
  setSortConfig,
  selectedTeams,
  setSelectedTeams,
  onClose,
}: {
  sortConfig: { key: 'name' | 'code'; direction: 'asc' | 'desc' } | null;
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: 'name' | 'code';
      direction: 'asc' | 'desc';
    } | null>
  >;
  selectedTeams: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}) {
  const handleToggleTeam = (teamCode: string) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamCode)) {
        return prev.filter((code) => code !== teamCode);
      } else {
        return [...prev, teamCode];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedTeams([]);
  };

  // For teams page, all teams are always available since we're filtering the teams themselves
  // So we don't need to disable any options - user can always select any team

  return (
    <div className='flex flex-col h-full bg-panel'>
      <div className='flex items-center justify-between p-6 pb-0'>
        <div>
          <h2 className='text-lg font-bold text-primary'>Filter & Sort</h2>
          <p className='text-sm text-ink-secondary'>
            Filter and sort AFL teams.
          </p>
        </div>
        <Button Icon={X} onClick={onClose} variant='ghost' />
      </div>

      <div className='flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar'>
        <div className='flex flex-col gap-4'>
          <h4 className='text-sm font-bold text-ink-primary border-b border-black/5 pb-2 dark:border-white/5'>
            Sort Teams
          </h4>
          <div className='flex gap-2'>
            <button
              onClick={() =>
                setSortConfig((prev) =>
                  prev?.key === 'name' ?
                    {
                      key: 'name',
                      direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    }
                  : { key: 'name', direction: 'asc' },
                )
              }
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-1 text-center',
                sortConfig?.key === 'name' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              Name{' '}
              {sortConfig?.key === 'name' ?
                sortConfig.direction === 'asc' ?
                  '↑'
                : '↓'
              : ''}
            </button>
            <button
              onClick={() =>
                setSortConfig((prev) =>
                  prev?.key === 'code' ?
                    {
                      key: 'code',
                      direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    }
                  : { key: 'code', direction: 'asc' },
                )
              }
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-1 text-center',
                sortConfig?.key === 'code' ?
                  'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
              )}
            >
              Code{' '}
              {sortConfig?.key === 'code' ?
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
            <h4 className='text-sm font-bold text-ink-primary'>
              Filter by Teams
            </h4>
            {selectedTeams.length > 0 && (
              <button
                onClick={handleClearAll}
                className='text-[10px] text-primary hover:underline font-semibold'
              >
                Clear ({selectedTeams.length})
              </button>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {teamsData.map((team) => {
              const isSelected = selectedTeams.includes(team.code);

              return (
                <button
                  key={team.code}
                  onClick={() => handleToggleTeam(team.code)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full transition-all',
                    isSelected ?
                      'bg-primary text-white shadow-md ring-2 ring-primary/20'
                    : 'bg-black/5 text-ink-secondary hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                  )}
                >
                  {team.code}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
