import { useState, useEffect } from 'react';
import type { Trade, Position, MonthlyRow, Plan, Headline } from './strategies';

export type LiveData = {
  lastUpdated: string;
  basis?: string;
  recentTrades: Trade[];
  positions: Position[];
  monthlyReturns?: MonthlyRow[];
  /** Setups not yet entered. Hyper bot only; other feeds omit it. */
  plans?: Plan[];
  /** Card/modal headline numbers for strategies with no meaningful CAGR yet. */
  headline?: Headline[];
  /** e.g. the mark used for unrealised P&L. */
  priceNote?: string;
};

const REPO_RAW = 'https://raw.githubusercontent.com/ericfongtrading/strategy-dashboard/main/data';
const cache: Record<string, { data: LiveData; ts: number }> = {};
const CACHE_TTL = 60_000;

export function useLiveData(strategyId: string) {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // An empty id means "this caller does not want a live feed" (a card that has
    // not opted in, or a closed modal). Fetching it would request data/.json.
    if (!strategyId) {
      setData(null);
      return;
    }
    const cached = cache[strategyId];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    fetch(`${REPO_RAW}/${strategyId}.json?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((d: LiveData) => {
        cache[strategyId] = { data: d, ts: Date.now() };
        setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [strategyId]);

  return { data, loading };
}
