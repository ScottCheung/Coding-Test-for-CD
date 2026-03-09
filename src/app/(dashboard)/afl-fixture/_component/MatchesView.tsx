/** @format */

'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { DataTable } from '@/components/UI/table/data-table';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { MatchCard } from '@/components/custom/afl/MatchCard';
import { MatchCardErrorBoundary } from '@/components/custom/afl/MatchCardErrorBoundary';
import { columns } from './columns';
import type { AflMatch } from '@/types/afl';
import { usePreferencesActions } from '@/lib/store/preferences-store';

interface MatchesViewProps {
  viewMode: 'card' | 'table';
  matches: (AflMatch & { roundCode: string })[];
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
}

const INITIAL_BATCH_SIZE = 20; // 初始只渲染20个
const LOAD_MORE_SIZE = 20; // 每次加载20个

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

  // 当 matches 变化时重置可见数量
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [matches]);

  // 安全地获取可见的 matches
  const visibleMatches = useMemo(() => {
    if (!Array.isArray(matches)) return [];
    return matches.slice(0, visibleCount);
  }, [matches, visibleCount]);

  const hasMore = matches && matches.length > visibleCount;

  // 加载更多的函数
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // 模拟加载延迟，让用户看到 loader
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_SIZE, matches.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, matches.length]);

  // Intersection Observer 监听滚动到底部
  useEffect(() => {
    if (!isClient || viewMode === 'table') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
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
    return <div className="min-h-[200px]" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <WaterfallLayout minColumnWidth={350}>
        {visibleMatches?.map?.((match, index) => {
          if (!match) return null;

          try {
            const homeScore = match.squads?.home?.score?.points ?? 0;
            const awayScore = match.squads?.away?.score?.points ?? 0;
            const scoreString = `${homeScore}:${awayScore}`;
            const layout = scoreString.length > 5;

            return (
              <MatchCardErrorBoundary
                key={`boundary-${match.roundCode}-${match.id}-${index}`}
              >
                <MatchCard
                  key={`${match.roundCode}-${match.id}-${index}`}
                  match={match}
                  visibility={columnVisibility}
                  layout={layout}
                />
              </MatchCardErrorBoundary>
            );
          } catch (error) {
            console.error('Error rendering match card:', error, match);
            return null;
          }
        })}
      </WaterfallLayout>

      {/* Infinite scroll loader */}
      {hasMore && (
        <div 
          ref={loaderRef}
          className="flex justify-center items-center py-8"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-ink-secondary">
              Loading more matches...
            </p>
          </div>
        </div>
      )}

      {/* 显示已加载的数量 */}
      {!hasMore && matches.length > INITIAL_BATCH_SIZE && (
        <div className="flex justify-center py-4">
          <p className="text-sm text-ink-secondary">
            All {matches.length} matches loaded
          </p>
        </div>
      )}
    </div>
  );
}
