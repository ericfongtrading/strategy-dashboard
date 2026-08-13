'use client';

import { useEffect } from 'react';

/**
 * Keeps the Model 1 card on the overview page current without a rebuild.
 *
 * The card's numbers come from lib/strategies.ts, which Next bakes into the
 * static export at build time — so they only ever moved on the twice-weekly
 * deploy and were days stale in between. This patches them in the browser from
 * the same `data` branch the Model 1 detail page reads, which the bot refreshes
 * every couple of minutes without triggering CI.
 *
 * The build-time values stay in the markup as the fallback: if this fetch fails,
 * or JavaScript never runs, the page still shows real (if older) numbers rather
 * than a blank or an error.
 */
const LIVE_URL =
  'https://raw.githubusercontent.com/siusunsun/strategy-dashboard/data/model_1_data.json';
const REFRESH_MS = 60000;

function fmtPnl(n: number): string {
  const abs = Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return (n >= 0 ? '+$' : '−$') + abs;
}

function setText(key: string, text: string) {
  document.querySelectorAll<HTMLElement>(`[data-live-kpi="${key}"]`).forEach((el) => {
    el.textContent = text;
  });
}

export function LiveKpi() {
  useEffect(() => {
    let alive = true;

    const load = () =>
      fetch(`${LIVE_URL}?t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => {
          if (!alive || !d) return;
          const s = d.summary || {};
          if (typeof s.cumulative_pnl === 'number') {
            setText('model-1:pnl', fmtPnl(s.cumulative_pnl));
            // The tone colour is baked in too, so a swing through zero would
            // otherwise leave a loss rendered in green.
            document
              .querySelectorAll<HTMLElement>('[data-live-kpi="model-1:pnl"]')
              .forEach((el) => {
                el.classList.remove('text-good', 'text-bad');
                el.classList.add(s.cumulative_pnl >= 0 ? 'text-good' : 'text-bad');
              });
          }
          if (typeof s.total_trades === 'number') {
            setText('model-1:trades', `${s.total_trades} 笔`);
          }
          if (d.updated_display) setText('model-1:updated', d.updated_display);
        })
        .catch(() => {
          /* keep whatever the build shipped — a blip must not blank the card */
        });

    load();
    const timer = setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
