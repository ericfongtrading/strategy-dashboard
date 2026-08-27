import { useState, useEffect } from 'react';
import type { Trade, Position } from './strategies';

type LiveData = {
  lastUpdated: string;
  recentTrades: Trade[];
  positions: Position[];
};

const REPO_RAW = 'https://raw.githubusercontent.com/ericfongtrading/strategy-dashboard/main/data';
const cache: Record<string, { data: LiveData; ts: number }> = {};
const CACHE_TTL = 60_000;

export function useLiveData(strategyId: string) {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
