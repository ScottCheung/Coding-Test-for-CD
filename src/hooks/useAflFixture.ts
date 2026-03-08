/** @format */

import { useQuery } from '@tanstack/react-query';
import { aflApi } from '@/lib/afl-api';
import type { AflFixture, AflMatch, AflRound } from '@/types/afl';

// ─── Raw fetch ──────────────────────────────────────────────────────────────

async function fetchFixture(): Promise<AflFixture> {
  const { data } = await aflApi.get<AflFixture>('/fixture');
  return data;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const aflKeys = {
  all: ['afl'] as const,
  fixture: () => [...aflKeys.all, 'fixture'] as const,
};

// ─── Main hook ──────────────────────────────────────────────────────────────

/**
 * Fetches the full AFL fixture and exposes helpers to derive rounds and
 * a flat match list with the round code attached.
 */
export function useAflFixture() {
  const query = useQuery({
    queryKey: aflKeys.fixture(),
    queryFn: fetchFixture,
    staleTime: 5 * 60 * 1000,   // 5 min – fixture data is static
    gcTime: 30 * 60 * 1000,     // keep in cache for 30 min
    retry: 2,
  });

  /** All rounds, flattened from all phases */
  const rounds: AflRound[] = query.data
    ? query.data.phases.flatMap((p) => p.rounds)
    : [];

  /** Sorted unique round codes e.g. ["R01", "R02", …] */
  const roundCodes: string[] = rounds.map((r) => r.code);

  /** All matches with their parent round code injected */
  const allMatches: (AflMatch & { roundCode: string })[] = rounds.flatMap(
    (round) =>
      round.matches.map((match) => ({
        ...match,
        roundCode: round.code,
      })),
  );

  /** All unique venue names */
  const venues: string[] = [
    ...new Set(allMatches.map((m) => m.venue?.name).filter(Boolean) as string[]),
  ].sort();

  /** All unique team names */
  const teams: string[] = [
    ...new Set(
      allMatches.flatMap((m) => [m.squads?.home?.name, m.squads?.away?.name]).filter(Boolean) as string[],
    ),
  ].sort();

  return {
    ...query,
    fixture: query.data ?? null,
    rounds,
    roundCodes,
    allMatches,
    venues,
    teams,
  };
}
