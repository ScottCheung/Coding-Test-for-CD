/** @format */

'use client';

import * as React from 'react';
import { Search, Settings2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/UI/popover';
import { AccountFilter, type Account } from './account-filter';
import { cn } from '@/lib/utils';
import { H4 } from '@/components/UI/text/typography';

interface TableToolbarProps {
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDebouncing?: boolean;
  };

  filter?: {
    accounts: Account[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    totalCount?: number;
    title?: string;
  };
  onSettingsClick: () => void;
  className?: string;
  isSettingsOpen?: boolean;
  children?: React.ReactNode;
}

export function TableToolbar({
  search,
  filter,
  onSettingsClick,
  className,
  isSettingsOpen,
  children,
}: TableToolbarProps) {
  const hasActiveFilters = filter ? filter.selectedIds.length > 0 : false;
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={cn('flex gap-4 flex-1 relative', className)}>
      {/* Search */}
      <motion.div
        layout
        animate={{
          width: isFocused ? 'w-full' : '50%',
          left: isFocused ? 0 : 'auto',
          right: isFocused ? 0 : 'auto',
          zIndex: isFocused ? 50 : 'auto',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className='relative'>
          <Search className='absolute left-4 top-1/2 size-4 z-20 -translate-y-1/2 text-ink-secondary group-focus-within:text-primary transition-colors' />

          <Input
            placeholder={search.placeholder || 'Search...'}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              '!pl-11 rounded-full text-ink-secondary',
              search.value.length > 0 && 'pr-11',
              isFocused && 'shadow-lg ring-2 ring-primary/20',
            )}
          />

          <AnimatePresence mode='wait'>
            {search.isDebouncing ?
              <motion.div
                key='spinner'
                initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className='absolute right-1 top-1/2 -translate-y-1/2 p-3 pointer-events-none'
              >
                <Loader2 className='size-4 animate-spin text-primary' />
              </motion.div>
            : search.value.length > 0 ?
              <motion.button
                key='clear-button'
                type='button'
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => search.onChange('')}
                className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-3 text-ink-secondary transition-colors cursor-pointer hover:text-ink-primary hover:bg-background'
              >
                <X className='size-4' />
              </motion.button>
            : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        animate={{
          opacity: isFocused ? 0 : 1,
          pointerEvents: isFocused ? 'none' : 'auto',
        }}
        transition={{ duration: 0.2 }}
        className='flex items-center gap-2 bg-glass p-1 rounded-full'
      >
        {children}
        {/* View Settings */}
        <Button
          variant={isSettingsOpen ? 'default' : 'ghost'}
          size='icon'
          className='rounded-full'
          onClick={onSettingsClick}
          title='View Settings'
        >
          <Settings2 className='size-4' />
        </Button>
      </motion.div>
    </div>
  );
}
