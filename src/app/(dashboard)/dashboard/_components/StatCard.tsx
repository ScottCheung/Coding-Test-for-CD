/** @format */

'use client';

import React from 'react';
import { Card } from '@/components/UI/card';
import { P } from '@/components/UI/text/typography';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: {
    text: string;
    icon?: LucideIcon;
    color: 'green' | 'blue' | 'purple' | 'orange';
  };
}

const colorClasses = {
  green:
    'bg-green-500/10 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  purple:
    'bg-purple-500/10 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  orange:
    'bg-orange-500/10 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
};

export function StatCard({ title, value, icon: Icon, badge }: StatCardProps) {
  const BadgeIcon = badge?.icon;

  return (
    <Card className='group relative overflow-hidden '>
      <div className='pointer-events-none absolute bottom-6 right-6 opacity-5 transition-transform duration-700 group-hover:scale-110'>
        <Icon className='size-[100px] text-primary' strokeWidth={1.5} />
      </div>
      <div className='relative z-10 flex flex-col'>
        <P className='text-ink-secondary'>{title}</P>
        <div className='mt-1 flex flex-col flex-wrap items-start gap-2'>
          <p className='text-3xl sm:text-4xl font-bold text-primary'>{value}</p>
          {badge && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${colorClasses[badge.color]}`}
            >
              {BadgeIcon && <BadgeIcon className='size-3' />}
              {badge.text}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
