/** @format */

import { useEffect } from 'react';
import { useHeaderStore } from '@/lib/store/header-store';
import { TableToolbar } from '@/components/custom/table-toolbar';
import { Button } from '@/components/UI/Button';
import { Filter } from 'lucide-react';

interface UseFixtureHeaderProps {
  search: string;
  onChange: (value: string) => void;
  isDebouncing: boolean;
  isSettingsOpen: boolean;
  isFilterOpen: boolean;
  activeFiltersCount: number;
  onSettingsClick: () => void;
  onFilterClick: () => void;
}

export function useFixtureHeader({
  search,
  onChange,
  isDebouncing,
  isSettingsOpen,
  isFilterOpen,
  activeFiltersCount,
  onSettingsClick,
  onFilterClick,
}: UseFixtureHeaderProps) {
  useEffect(() => {
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
          onSettingsClick={onSettingsClick}
          isSettingsOpen={isSettingsOpen}
        >
          <Button
            variant={isFilterOpen ? 'default' : 'ghost'}
            size='icon'
            className='rounded-full relative'
            onClick={onFilterClick}
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
    activeFiltersCount,
    onSettingsClick,
    onFilterClick,
    onChange,
  ]);
}
