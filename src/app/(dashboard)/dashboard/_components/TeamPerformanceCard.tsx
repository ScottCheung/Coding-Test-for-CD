/** @format */

'use client';

import React from 'react';
import { Card } from '@/components/UI/card';
import { H2 } from '@/components/UI/text/typography';
import { motion } from 'framer-motion';

interface TeamStats {
  team: string;
  wins: number;
  losses: number;
  draws: number;
}

interface TeamPerformanceCardProps {
  teamPerformance: TeamStats[];
}

export function TeamPerformanceCard({
  teamPerformance,
}: TeamPerformanceCardProps) {
  return (
    <Card className='p-4 sm:p-6'>
      <H2 className='mb-4 text-primary'>Team Performance (Top 10)</H2>
      <div className='space-y-2'>
        {teamPerformance.map((team, index) => (
          <motion.div
            key={team.team}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className='flex items-center gap-2 sm:gap-4 rounded-xl p-2 sm:p-3 transition-colors hover:bg-background'
          >
            <div className='flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-bold text-primary'>
              {index + 1}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-xs sm:text-sm font-bold text-ink-secondary truncate'>
                {team.team}
              </p>
              <div className='flex gap-2 sm:gap-3 text-[10px] sm:text-xs text-ink-secondary mt-0.5'>
                <span className='text-green-600 dark:text-green-400 font-medium'>
                  {team.wins}W
                </span>
                <span className='text-red-600 dark:text-red-400 font-medium'>
                  {team.losses}L
                </span>
                {team.draws > 0 && (
                  <span className='text-gray-600 dark:text-gray-400 font-medium'>
                    {team.draws}D
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-1 sm:gap-2'>
              <div className='h-2 w-16 sm:w-24 overflow-hidden rounded-full bg-background'>
                <div
                  className='h-full bg-primary transition-all'
                  style={{
                    width: `${(team.wins / (team.wins + team.losses + team.draws)) * 100}%`,
                  }}
                />
              </div>
              <span className='text-[10px] sm:text-xs font-bold text-primary w-8 sm:w-12 text-right'>
                {(
                  (team.wins / (team.wins + team.losses + team.draws)) *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
