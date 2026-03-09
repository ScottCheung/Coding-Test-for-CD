/** @format */

'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { DataTable } from '@/components/UI/table/data-table';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { MatchCard } from '@/components/custom/afl/MatchCard';
import { columns } from './columns';
import type { AflMatch } from '@/types/afl';
import { usePreferencesActions } from '@/lib/store/preferences-store';
import { Skeleton } from '@/components/UI/Skeleton/Skeleton';

interface MatchesViewProps {
  viewMode: 'card' | 'table';
  matches: (AflMatch & { roundCode: string })[];
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
}

const INITIAL_BATCH_SIZE = 20;
const LOAD_MORE_SIZE = 20;

export function MatchesView({
  viewMode,
  matches,
  columnVisibility,
  columnOrder,
}: MatchesViewProps) {
  const { setColumnSettings } = usePreferencesActions();
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [matches]);

  const visibleMatches = useMemo(() => {
    if (!Array.isArray(matches)) return [];
    return matches.slice(0, visibleCount);
  }, [matches, visibleCount]);

  const hasMore = matches && matches.length > visibleCount;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_SIZE, matches.length),
      );
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, matches.length]);

  useEffect(() => {
    if (!isClient || viewMode === 'table') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [isClient, viewMode, hasMore, isLoading, loadMore]);

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

  // 服务端渲染时返回空，避免 hydration 问题
  if (!isClient) {
    return <div className='min-h-[200px]' />;
  }

  return (
    <div className='flex flex-col gap-4'>
      <WaterfallLayout minColumnWidth={350}>
        {visibleMatches?.map?.((match, index) => {
          if (!match) return null;

          try {
            const homeScore = match.squads?.home?.score?.points ?? 0;
            const awayScore = match.squads?.away?.score?.points ?? 0;
            const scoreString = `${homeScore}:${awayScore}`;
            const layout = scoreString.length > 5;

            return (
              <MatchCard
                key={`${match.roundCode}-${match.id}-${index}`}
                match={match}
                visibility={columnVisibility}
                layout={layout}
              />
            );
          } catch (error) {
            console.error('Error rendering match card:', error, match);
            return null;
          }
        })}
        {/* Infinite scroll loader */}
        {hasMore && (
          <div ref={loaderRef}>
            <Skeleton variant='rectangular' className={`h-[300px]`} />{' '}
          </div>
        )}
        {hasMore && (
          <Skeleton
            variant='rectangular'
            className={`h-[400px] bg-panel rounded-card overflow-hidden`}
          />
        )}
        {hasMore && (
          <Skeleton
            variant='rectangular'
            className={`h-[500px] bg-panel rounded-card overflow-hidden`}
          />
        )}
        {hasMore && (
          <Skeleton
            variant='rectangular'
            className={`h-[200px] bg-panel rounded-card overflow-hidden`}
          />
        )}
        {hasMore && (
          <Skeleton
            variant='rectangular'
            className={`h-[300px] bg-panel rounded-card overflow-hidden`}
          />
        )}
      </WaterfallLayout>

      {/* 显示已加载的数量 */}
      {!hasMore && matches.length > INITIAL_BATCH_SIZE && (
        <div className='flex justify-center py-4'>
          <p className='text-sm text-ink-secondary'>
            All {matches.length} matches loaded
          </p>
        </div>
      )}
    </div>
  );
}
