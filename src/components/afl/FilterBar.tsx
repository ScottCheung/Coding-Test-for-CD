/** @format */

'use client';

import React from 'react';
import { Select } from '@/components/UI/select/select';

interface FilterBarProps {
  rounds: string[];
  venues: string[];
  teams: string[];
  selectedRound: string;
  selectedVenue: string;
  selectedTeam: string;
  onRoundChange: (r: string) => void;
  onVenueChange: (v: string) => void;
  onTeamChange: (t: string) => void;
}

export function FilterBar({
  rounds,
  venues,
  teams,
  selectedRound,
  selectedVenue,
  selectedTeam,
  onRoundChange,
  onVenueChange,
  onTeamChange,
}: FilterBarProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='flex-1'>
        <Select
          label='Round'
          value={selectedRound}
          onChange={(e) => onRoundChange(e.target.value)}
          placeholder='All Rounds'
        >
          <option value=''>All Rounds</option>
          {rounds.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </div>

      <div className='flex-1'>
        <Select
          label='Venue'
          value={selectedVenue}
          onChange={(e) => onVenueChange(e.target.value)}
          placeholder='All Venues'
        >
          <option value=''>All Venues</option>
          {venues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <div className='flex-1'>
        <Select
          label='Team'
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
          placeholder='All Teams'
        >
          <option value=''>All Teams</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
