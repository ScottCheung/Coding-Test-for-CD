/** @format */

import { useMemo } from 'react';

interface Match {
  status?: { code?: string; name?: string };
  squads?: {
    home?: { name?: string; score?: { points?: number } };
    away?: { name?: string; score?: { points?: number } };
  };
  roundCode: string;
  venue?: { name?: string };
}

export function useAflStats(allMatches: Match[], teams: string[], venues: string[]) {
  const stats = useMemo(() => {
    if (!allMatches || allMatches.length === 0) {
      return {
        totalMatches: 0,
        completedMatches: 0,
        scheduledMatches: 0,
        liveMatches: 0,
        totalTeams: teams?.length || 0,
        totalVenues: venues?.length || 0,
        avgScore: '0.0',
        highestScoringMatch: null,
      };
    }

    const completedMatches = allMatches.filter((m) => m.status?.code === 'COMP');
    const scheduledMatches = allMatches.filter((m) => m.status?.code === 'SCHD');
    const liveMatches = allMatches.filter((m) => m.status?.code === 'LIVE');

    const totalScore = completedMatches.reduce((sum, m) => {
      const homeScore = m.squads?.home?.score?.points || 0;
      const awayScore = m.squads?.away?.score?.points || 0;
      return sum + homeScore + awayScore;
    }, 0);

    const avgScore = completedMatches.length > 0 ? totalScore / completedMatches.length : 0;

    const highestScoringMatch = completedMatches.length > 0 
      ? completedMatches.reduce((max, m) => {
          const total =
            (m.squads?.home?.score?.points || 0) + (m.squads?.away?.score?.points || 0);
          const maxTotal =
            (max.squads?.home?.score?.points || 0) + (max.squads?.away?.score?.points || 0);
          return total > maxTotal ? m : max;
        }, completedMatches[0])
      : null;

    return {
      totalMatches: allMatches.length,
      completedMatches: completedMatches.length,
      scheduledMatches: scheduledMatches.length,
      liveMatches: liveMatches.length,
      totalTeams: teams?.length || 0,
      totalVenues: venues?.length || 0,
      avgScore: avgScore.toFixed(1),
      highestScoringMatch,
    };
  }, [allMatches, teams, venues]);

  const matchesByRound = useMemo(() => {
    if (!allMatches || allMatches.length === 0) return [];
    
    const roundMap = new Map<string, number>();
    allMatches.forEach((m) => {
      const count = roundMap.get(m.roundCode) || 0;
      roundMap.set(m.roundCode, count + 1);
    });

    return Array.from(roundMap.entries())
      .map(([round, count]) => ({ round, count }))
      .sort((a, b) => {
        const aNum = parseInt(a.round.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.round.replace(/\D/g, '')) || 0;
        return aNum - bNum;
      });
  }, [allMatches]);

  const scoresDistribution = useMemo(() => {
    if (!allMatches || allMatches.length === 0) {
      return [
        { range: '0-50', min: 0, max: 50, count: 0 },
        { range: '51-100', min: 51, max: 100, count: 0 },
        { range: '101-150', min: 101, max: 150, count: 0 },
        { range: '151-200', min: 151, max: 200, count: 0 },
        { range: '200+', min: 201, max: Infinity, count: 0 },
      ];
    }

    const completedMatches = allMatches.filter((m) => m.status?.code === 'COMP');
    const ranges = [
      { range: '0-50', min: 0, max: 50, count: 0 },
      { range: '51-100', min: 51, max: 100, count: 0 },
      { range: '101-150', min: 101, max: 150, count: 0 },
      { range: '151-200', min: 151, max: 200, count: 0 },
      { range: '200+', min: 201, max: Infinity, count: 0 },
    ];

    completedMatches.forEach((m) => {
      const total =
        (m.squads?.home?.score?.points || 0) + (m.squads?.away?.score?.points || 0);
      const range = ranges.find((r) => total >= r.min && total <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [allMatches]);

  const matchesByVenue = useMemo(() => {
    if (!allMatches || allMatches.length === 0) return [];
    
    const venueMap = new Map<string, number>();
    allMatches.forEach((m) => {
      if (m.venue?.name) {
        const count = venueMap.get(m.venue.name) || 0;
        venueMap.set(m.venue.name, count + 1);
      }
    });

    return Array.from(venueMap.entries())
      .map(([venue, matches]) => ({ venue, matches }))
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 8);
  }, [allMatches]);

  const teamPerformance = useMemo(() => {
    if (!allMatches || allMatches.length === 0) return [];
    
    const teamStats = new Map<string, { wins: number; losses: number; draws: number }>();

    allMatches
      .filter((m) => m.status?.code === 'COMP')
      .forEach((m) => {
        const homeName = m.squads?.home?.name;
        const awayName = m.squads?.away?.name;
        const homeScore = m.squads?.home?.score?.points || 0;
        const awayScore = m.squads?.away?.score?.points || 0;

        if (homeName) {
          const homeStats = teamStats.get(homeName) || { wins: 0, losses: 0, draws: 0 };
          if (homeScore > awayScore) homeStats.wins++;
          else if (homeScore < awayScore) homeStats.losses++;
          else homeStats.draws++;
          teamStats.set(homeName, homeStats);
        }

        if (awayName) {
          const awayStats = teamStats.get(awayName) || { wins: 0, losses: 0, draws: 0 };
          if (awayScore > homeScore) awayStats.wins++;
          else if (awayScore < homeScore) awayStats.losses++;
          else awayStats.draws++;
          teamStats.set(awayName, awayStats);
        }
      });

    return Array.from(teamStats.entries())
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 10);
  }, [allMatches]);

  const statusBreakdown = useMemo(() => {
    if (!allMatches || allMatches.length === 0) return [];
    
    const statusMap = new Map<string, number>();
    allMatches.forEach((m) => {
      const status = m.status?.name || 'Unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    return Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));
  }, [allMatches]);

  return {
    stats,
    matchesByRound,
    scoresDistribution,
    matchesByVenue,
    teamPerformance,
    statusBreakdown,
  };
}
