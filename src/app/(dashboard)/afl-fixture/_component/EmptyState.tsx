/** @format */

import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
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
      <h3 className='text-lg font-bold text-ink-primary'>No matches found</h3>
      <p className='mt-1 text-sm text-ink-secondary'>
        Try adjusting your filters to see more results.
      </p>
      <button
        onClick={onClearFilters}
        className='mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95'
      >
        Clear Filters
      </button>
    </motion.div>
  );
}
