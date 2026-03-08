/** @format */

'use client';

import React from 'react';
import { useAflFixture } from '@/hooks/useAflFixture';
import { Card } from '@/components/UI/card';
import { H1, H2, Muted } from '@/components/UI/text/typography';
import { Chart } from '@/components/UI/Chart';
import { Stagger, StaggerItem } from '@/components/animation';
import {
  Trophy,
  Users,
  MapPin,
  Target,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { VenueMap } from '@/app/(dashboard)/dashboard/_components/VenueMap';
import { StatCard } from './_components/StatCard';
import { AnalyticsChart } from './_components/AnalyticsChart';
import { TeamPerformanceCard } from './_components/TeamPerformanceCard';
import { HighestScoringCard } from './_components/HighestScoringCard';
import { StatusSummaryCard } from './_components/StatusSummaryCard';
import { useAflStats } from './_components/useAflStats';
import { useHeaderStore } from '@/lib/store/header-store';

export default function DashboardPage() {
  const { allMatches, teams, venues, isLoading } = useAflFixture();
  const {
    stats,
    matchesByRound,
    scoresDistribution,
    matchesByVenue,
    teamPerformance,
    statusBreakdown,
  } = useAflStats(allMatches, teams, venues);

  React.useEffect(() => {
    useHeaderStore.getState().setHeader({
      title: 'AFL Dashboard',
      description: 'Comprehensive overview of the AFL Premiership Season',
    });
  }, []);

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <div className='size-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4' />
          <p className='text-ink-secondary'>Loading AFL data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Key Stats Grid */}

      <Stagger
        staggerDelay={0.15}
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
      >
        <StaggerItem yOffset={20}>
          <StatCard
            title='Total Matches'
            value={stats.totalMatches}
            icon={Trophy}
            badge={{
              text: `${stats.completedMatches} done`,
              icon: Activity,
              color: 'green',
            }}
          />
        </StaggerItem>
        <StaggerItem yOffset={20}>
          <StatCard
            title='Teams'
            value={stats.totalTeams}
            icon={Users}
            badge={{ text: 'Active', color: 'blue' }}
          />
        </StaggerItem>
        <StaggerItem yOffset={20}>
          <StatCard
            title='Venues'
            value={stats.totalVenues}
            icon={MapPin}
            badge={{ text: 'Locations', color: 'purple' }}
          />{' '}
        </StaggerItem>
        <StaggerItem yOffset={20}>
          <StatCard
            title='Avg Score'
            value={stats.avgScore}
            icon={Target}
            badge={{ text: 'Points', icon: TrendingUp, color: 'orange' }}
          />{' '}
        </StaggerItem>
      </Stagger>

      {/* Interactive Charts Section */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <H2 className='text-primary'>Season Analytics</H2>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <AnalyticsChart
            scoresDistribution={scoresDistribution}
            matchesByRound={matchesByRound}
            matchesByVenue={matchesByVenue}
          />

          {/* Match Status Pie Chart */}
          <Card className='p-card'>
            <H2 className='mb-4 text-primary'>Match Status</H2>
            <Chart
              type='pie'
              data={statusBreakdown}
              nameKey='name'
              valueKey='value'
              size='md'
              multiColor
            />
          </Card>
        </div>
      </div>

      {/* Team Performance & Recent Matches */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Team Leaderboard */}
        <div className='lg:col-span-2'>
          <TeamPerformanceCard teamPerformance={teamPerformance} />
        </div>

        {/* Quick Stats */}
        <div className='space-y-6'>
          {/* Highest Scoring Match */}
          {stats.highestScoringMatch?.squads && (
            <HighestScoringCard match={stats.highestScoringMatch} />
          )}

          {/* Match Status Summary */}
          <StatusSummaryCard
            completedMatches={stats.completedMatches}
            scheduledMatches={stats.scheduledMatches}
            liveMatches={stats.liveMatches}
          />
        </div>
      </div>

      {/* Interactive Venue Map */}
      <div>
        <H2 className='mb-4 text-primary'>Venue Map</H2>

        <VenueMap matches={allMatches} />
      </div>
    </div>
  );
}
