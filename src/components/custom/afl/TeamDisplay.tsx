/** @format */

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Small } from '@/components/UI/text/typography';

interface TeamDisplayProps {
  code: string;
  name: string;
  score?: {
    goals: number;
    behinds: number;
    points: number;
  };
  isWinner: boolean;
  showName: boolean;
  showScore: boolean;
  isComplete: boolean;
  align?: 'left' | 'right' | 'center';
  layout?: boolean;
}

export function TeamDisplay({
  code,
  name,
  score,
  isWinner,
  showName,
  showScore,
  isComplete,
  align = 'center',
  layout = false,
}: TeamDisplayProps) {
  const isWaterfallVertical = layout;

  return (
    <div
      className={cn(
        'flex flex-1 items-center transition-all duration-300',
        isWaterfallVertical ? 'flex-col gap-3' : 'gap-4',
        align === 'right' &&
          !isWaterfallVertical &&
          'flex-row-reverse text-right',
        align === 'left' && !isWaterfallVertical && 'text-left',
        align === 'center' && 'flex-col text-center',
      )}
    >
      <div className='relative flex flex-col items-center group'>
        <div
          className={cn(
            'relative ',
            isWaterfallVertical ? 'size-16' : 'size-14 sm:size-16',
          )}
        >
          {isWinner && (
            <div className='group-hover:opacity-100 max-size-20 opacity-0 absolute  right-1 top-0  transition-all duration-700 z-20 group-hover:-top-[30px] animate-bounce'>
              <Image 
                src='/crown.png' 
                alt='crown'
                width={80}
                height={80}
                className='size-full object-contain'
              />
            </div>
          )}
          <Image
            src={`https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/${code}.svg`}
            alt={`${name} logo`}
            width={64}
            height={64}
            className='size-full object-contain'
            unoptimized
            loading='lazy'
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement!;
              const fb = document.createElement('div');
              fb.className =
                'size-full flex items-center justify-center text-primary font-black text-sm';
              fb.textContent = code;
              parent.appendChild(fb);
            }}
          />

          {isWinner && (
            <div className='group-hover:opacity-100 opacity-0 absolute dark:invert right-0 top-0 rotate-0 transition-all  duration-700  group-hover:-right-5 group-hover:-top-3 group-hover:rotate-20 p-1 flex  h-5 items-center justify-center rounded-full bg-black  shadow-sm ring-2 ring-white dark:ring-panel'>
              <span className='text-[8px] font-black  text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-lime-500'>
                WINNER
              </span>
            </div>
          )}
        </div>

        {showName && (
          <div className='mt-2 max-w-[80px] sm:max-w-[100px]'>
            <Small
              className={cn(
                'line-clamp-1 text-[10px] font-bold tracking-tight text-ink-primary opacity-30',
              )}
            >
              {name}
            </Small>
          </div>
        )}
      </div>

      {showScore && isComplete && score && (
        <div
          className={cn(
            'flex flex-col-reverse ',
            align === 'center' || isWaterfallVertical ? 'items-center'
            : align === 'right' ? 'items-end'
            : 'items-start',
          )}
        >
          <div
            className={cn(
              'text-2xl flex relative font-black tabular-nums tracking-tighter opacity-30 text-ink-primary group-hover:opacity-100 group-hover:text-red-500 sm:text-3xl',
              isWinner && ' opacity-100 group-hover:text-green-500 ',
            )}
          >
            {score.points}
          </div>

          <div className='text-[9px] font-bold text-ink-secondary opacity-60'>
            {score.goals}.{score.behinds}
          </div>
        </div>
      )}
    </div>
  );
}
