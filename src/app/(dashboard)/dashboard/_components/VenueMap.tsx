/** @format */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AflMatch } from '@/types/afl';
import { getVenueCoordinates } from '@/lib/venue-coordinates';
import dayjs from 'dayjs';

interface VenueMapProps {
  matches: (AflMatch & { roundCode: string })[];
  className?: string;
}

interface VenueData {
  name: string;
  lat: number;
  lng: number;
  city: string;
  matches: (AflMatch & { roundCode: string })[];
}

export function VenueMap({ matches, className }: VenueMapProps) {
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);

  // Group matches by venue
  const venueData = useMemo(() => {
    const venueMap = new Map<string, VenueData>();

    matches.forEach((match) => {
      const venueName = match.venue?.name;
      if (!venueName) return;

      if (!venueMap.has(venueName)) {
        const coords = getVenueCoordinates(venueName);
        venueMap.set(venueName, {
          name: venueName,
          lat: coords.lat,
          lng: coords.lng,
          city: coords.city,
          matches: [],
        });
      }

      venueMap.get(venueName)!.matches.push(match);
    });

    return Array.from(venueMap.values());
  }, [matches]);

  // Calculate map bounds
  const bounds = useMemo(() => {
    const lats = venueData.map((v) => v.lat);
    const lngs = venueData.map((v) => v.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [venueData]);

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const padding = 50;
    const width = 800;
    const height = 600;

    const x =
      padding +
      ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
        (width - 2 * padding);
    const y =
      height -
      padding -
      ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) *
        (height - 2 * padding);

    return { x, y };
  };

  // Use selectedVenue if set, otherwise hoveredVenue
  const activeVenue = selectedVenue || hoveredVenue;
  const activeVenueData = venueData.find((v) => v.name === activeVenue);

  return (
    <div className={cn('relative', className)}>
      {/* Map SVG */}
      <svg
        viewBox='0 0 800 600'
        className='w-full h-auto bg-gradient-to-br from-blue-50 to-green-50 dark:from-zinc-900 dark:to-zinc-800 rounded-card border border-black/5 dark:border-white/5'
      >
        {/* Australia outline (simplified) */}
        <path
          d='M 100 100 Q 150 80 200 100 L 250 120 L 300 110 L 350 130 L 400 140 L 450 150 L 500 160 L 550 150 L 600 140 L 650 160 L 680 200 L 690 250 L 680 300 L 650 350 L 600 400 L 550 430 L 500 450 L 450 460 L 400 470 L 350 480 L 300 470 L 250 450 L 200 420 L 150 380 L 120 330 L 100 280 L 90 230 L 100 180 Z'
          fill='currentColor'
          className='text-blue-100/30 dark:text-blue-900/20'
          stroke='currentColor'
          strokeWidth='2'
          strokeOpacity='0.2'
        />

        {/* Connection lines */}
        {venueData.map((venue, i) => {
          const pos = latLngToXY(venue.lat, venue.lng);
          return venueData.slice(i + 1).map((otherVenue, j) => {
            const otherPos = latLngToXY(otherVenue.lat, otherVenue.lng);
            return (
              <line
                key={`${i}-${j}`}
                x1={pos.x}
                y1={pos.y}
                x2={otherPos.x}
                y2={otherPos.y}
                stroke='currentColor'
                strokeWidth='1'
                strokeOpacity='0.05'
                className='text-primary'
              />
            );
          });
        })}

        {/* Venue markers */}
        {venueData.map((venue) => {
          const pos = latLngToXY(venue.lat, venue.lng);
          const isActive = venue.name === activeVenue;
          const size = isActive ? 16 : 12;

          return (
            <g
              key={venue.name}
              onMouseEnter={() => setHoveredVenue(venue.name)}
              onMouseLeave={() => setHoveredVenue(null)}
              onClick={() =>
                setSelectedVenue(
                  selectedVenue === venue.name ? null : venue.name,
                )
              }
              className='cursor-pointer'
            >
              {/* Pulse animation for active venue - using CSS animation */}
              {isActive && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + 8}
                  fill='currentColor'
                  className='text-primary'
                  opacity='0.3'
                >
                  <animate
                    attributeName='r'
                    from={size + 8}
                    to={size + 20}
                    dur='1.5s'
                    repeatCount='indefinite'
                  />
                  <animate
                    attributeName='opacity'
                    from='0.3'
                    to='0'
                    dur='1.5s'
                    repeatCount='indefinite'
                  />
                </circle>
              )}

              {/* Outer ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size + 4}
                fill='currentColor'
                className={cn(
                  'transition-all duration-300',
                  isActive ?
                    'text-primary opacity-20'
                  : 'text-primary opacity-10',
                )}
              />

              {/* Main marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill='currentColor'
                className={cn(
                  'transition-all duration-300',
                  isActive ? 'text-primary' : (
                    'text-primary/60 hover:text-primary'
                  ),
                )}
              />

              {/* Match count badge */}
              <circle
                cx={pos.x + size - 2}
                cy={pos.y - size + 2}
                r={8}
                fill='white'
                className='dark:fill-zinc-800'
              />
              <text
                x={pos.x + size - 2}
                y={pos.y - size + 2}
                textAnchor='middle'
                dominantBaseline='middle'
                className='text-[10px] font-bold fill-primary pointer-events-none'
              >
                {venue.matches.length}
              </text>

              {/* City label */}
              <text
                x={pos.x}
                y={pos.y + size + 16}
                textAnchor='middle'
                className={cn(
                  'text-xs font-bold transition-all duration-300 pointer-events-none',
                  isActive ? 'fill-primary' : 'fill-ink-secondary',
                )}
              >
                {venue.city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Venue details popup */}
      <AnimatePresence mode='wait'>
        {activeVenueData && (
          <motion.div
            key={activeVenueData.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute top-4 z-50 right-4 w-80 max-h-96 overflow-hidden rounded-2xl border border-black/10 bg-panel shadow-2xl dark:border-white/10'
          >
            {/* Header */}
            <div className='flex items-start justify-between border-b border-black/5 bg-primary/5 p-4 dark:border-white/5'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 text-primary'>
                  <MapPin className='size-5' />
                  <h3 className='font-bold'>{activeVenueData.name}</h3>
                </div>
                <p className='mt-1 text-sm text-ink-secondary'>
                  {activeVenueData.city} • {activeVenueData.matches.length}{' '}
                  matches
                </p>
              </div>
              {selectedVenue && (
                <button
                  onClick={() => setSelectedVenue(null)}
                  className='rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5'
                >
                  <X className='size-4 text-ink-secondary' />
                </button>
              )}
            </div>

            {/* Matches list */}
            <div className='max-h-64 overflow-y-auto custom-scrollbar p-2'>
              {activeVenueData.matches
                .sort((a, b) => {
                  const dateA =
                    a.date?.utcMatchStart ?
                      dayjs(a.date.utcMatchStart).valueOf()
                    : 0;
                  const dateB =
                    b.date?.utcMatchStart ?
                      dayjs(b.date.utcMatchStart).valueOf()
                    : 0;
                  return dateB - dateA;
                })
                .slice(0, 10)
                .map((match) => {
                  const homeScore = match.squads?.home?.score?.points || 0;
                  const awayScore = match.squads?.away?.score?.points || 0;
                  const isComplete = match.status?.code === 'COMP';

                  return (
                    <div
                      key={match.id}
                      className='mb-2 rounded-xl border border-black/5 bg-background p-3 transition-colors hover:border-primary/20 dark:border-white/5'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <span className='inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary'>
                          {match.roundCode}
                        </span>
                        <span className='text-[10px] text-ink-secondary'>
                          {match.date?.utcMatchStart ?
                            dayjs(match.date.utcMatchStart).format(
                              'MMM D, YYYY',
                            )
                          : 'TBD'}
                        </span>
                      </div>

                      <div className='space-y-1'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-bold text-ink-primary'>
                            {match.squads?.home?.name || 'TBD'}
                          </span>
                          {isComplete && (
                            <span
                              className={cn(
                                'font-mono font-bold',
                                homeScore > awayScore && 'text-primary',
                              )}
                            >
                              {homeScore}
                            </span>
                          )}
                        </div>

                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-bold text-ink-primary'>
                            {match.squads?.away?.name || 'TBD'}
                          </span>
                          {isComplete && (
                            <span
                              className={cn(
                                'font-mono font-bold',
                                awayScore > homeScore && 'text-primary',
                              )}
                            >
                              {awayScore}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isComplete && (
                        <div className='mt-2 text-center'>
                          <span className='inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400'>
                            <Calendar className='size-3' />
                            {match.status?.name || 'Scheduled'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            {activeVenueData.matches.length > 10 && (
              <div className='border-t border-black/5 bg-background p-3 text-center dark:border-white/5'>
                <p className='text-xs text-ink-secondary'>
                  Showing 10 of {activeVenueData.matches.length} matches
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className='absolute bottom-4 left-4 rounded-xl border border-black/10 bg-panel/95 p-3 backdrop-blur-sm dark:border-white/10'>
        <div className='flex items-center gap-4 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='size-3 rounded-full bg-primary' />
            <span className='text-ink-secondary'>Venue</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary dark:bg-zinc-800'>
              #
            </div>
            <span className='text-ink-secondary'>Match count</span>
          </div>
        </div>
      </div>
    </div>
  );
}
