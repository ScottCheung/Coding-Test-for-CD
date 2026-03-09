/** @format */

import React from 'react';
import { Button } from '@/components/UI/Button';
import { Switch } from '@/components/UI/switch';
import { X, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePreferencesStore,
  usePreferencesActions,
} from '@/lib/store/preferences-store';
import { useLayoutStore } from '@/lib/store/layout-store';

export function AflViewSettings() {
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
