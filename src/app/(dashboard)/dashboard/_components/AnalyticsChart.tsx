/** @format */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/UI/card';
import { H2 } from '@/components/UI/text/typography';
import { Chart } from '@/components/UI/Chart';
import { SegmentedControl } from '@/components/UI/segmented-control';
import { BarChart3, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  scoresDistribution: Array<{ range: string; count: number }>;
  matchesByRound: Array<{ round: string; count: number }>;
  matchesByVenue: Array<{ venue: string; matches: number }>;
}

export function AnalyticsChart({
  scoresDistribution,
  matchesByRound,
  matchesByVenue,
}: AnalyticsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<
    'scores' | 'matches' | 'venues'
  >('scores');

  return (
    <Card className='p-4 sm:p-6 flex flex-col gap-4 sm:gap-6'>
      <SegmentedControl
        value={selectedMetric}
        onChange={(value) => setSelectedMetric(value as any)}
        options={[
          { label: 'Scores', value: 'scores', icon: BarChart3 },
          { label: 'Matches', value: 'matches', icon: Calendar },
          { label: 'Venues', value: 'venues', icon: MapPin },
        ]}
      />
      
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className='flex-1 min-h-0'
      >
        {selectedMetric === 'scores' && (
          <div className='flex flex-col h-full'>
            <H2 className='mb-4 text-primary text-base sm:text-lg'>
              Score Distribution
            </H2>
            <div className='flex-1 min-h-0'>
              <Chart
                type='bar'
                data={scoresDistribution}
                xKey='range'
                yKey='count'
                size='md'
                color='#3b82f6'
                showGridY
              />
            </div>
          </div>
        )}

        {selectedMetric === 'matches' && (
          <div className='flex flex-col h-full'>
            <H2 className='mb-4 text-primary text-base sm:text-lg'>
              Matches by Round
            </H2>
            <div className='flex-1 min-h-0'>
              <Chart
                type='area'
                data={matchesByRound}
                xKey='round'
                yKeys={['count']}
                size='md'
                color='#8b5cf6'
                gradientFill
                showDots
              />
            </div>
          </div>
        )}

        {selectedMetric === 'venues' && (
          <div className='flex flex-col h-full'>
            <H2 className='mb-4 text-primary text-base sm:text-lg'>
              Top Venues
            </H2>
            <div className='flex-1 min-h-0'>
              <Chart
                type='bar'
                data={matchesByVenue}
                xKey='venue'
                yKey='matches'
                size='md'
                color='#10b981'
                showGridY
              />
            </div>
          </div>
        )}
      </motion.div>
    </Card>
  );
}
