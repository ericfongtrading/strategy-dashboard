'use client';

import { useState } from 'react';
import { strategies } from '@/lib/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { StrategyModal } from '@/components/StrategyModal';
import type { Strategy } from '@/lib/strategies';

export default function Home() {
  const [selected, setSelected] = useState<Strategy | null>(null);

  const tradfi = strategies.filter((s) => s.category === 'tradfi');
  const crypto = strategies.filter((s) => s.category === 'crypto');
  const ml = strategies.filter((s) => s.category === 'ml');

  return (
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <header className="noise-bg border-b border-border">
          <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Strategy Dashboard
            </h1>
            <p className="mt-2 text-base text-muted max-w-2xl">
              Systematic trading strategies across futures, FX, crypto, and options.
              All strategies backtested with walk-forward validation, bootstrap drawdown analysis,
              and Monte Carlo simulation.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
          {/* TradFi */}
          <section>
            <SectionHeader title="Traditional Finance" count={tradfi.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tradfi.map((s) => (
                <StrategyCard key={s.id} s={s} onClick={() => setSelected(s)} />
              ))}
            </div>
          </section>

          {/* Crypto */}
          <section>
            <SectionHeader title="Crypto" count={crypto.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {crypto.map((s) => (
                <StrategyCard key={s.id} s={s} onClick={() => setSelected(s)} />
              ))}
            </div>
          </section>

          {/* Machine Learning */}
          <section>
            <SectionHeader title="Machine Learning" count={ml.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ml.map((s) => (
                <StrategyCard key={s.id} s={s} onClick={() => setSelected(s)} />
              ))}
            </div>
          </section>

          {/* Methodology */}
          <section className="rounded-xl border border-border bg-bg-card p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-4">Methodology</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MethodItem
                title="Walk-Forward"
                desc="Out-of-sample validation with rolling train/test windows to prevent overfitting"
              />
              <MethodItem
                title="Bootstrap DD"
                desc="Resampled drawdown distribution for realistic worst-case capital requirements"
              />
              <MethodItem
                title="Monte Carlo"
                desc="Simulated trade sequences to stress-test edge persistence across regimes"
              />
              <MethodItem
                title="R-Multiples"
                desc="ATR-normalized risk measurement for cross-asset comparison and capital allocation"
              />
            </div>
          </section>

          {/* Infrastructure */}
          <section className="rounded-xl border border-border bg-bg-card p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-3">Infrastructure</h3>
            <p className="text-sm text-muted leading-relaxed max-w-3xl">
              Python backtesting framework with automated execution via IB Gateway API.
              Strategies deployed on VPS for 24/7 operation with real-time position management,
              risk monitoring, and portfolio-level drawdown controls.
              Built using AI-assisted development for rapid iteration from idea to live deployment.
            </p>
          </section>
        </div>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted flex flex-wrap items-center justify-between gap-2">
            <div>&copy; {new Date().getFullYear()} Eric Fong</div>
            <div>Built with Next.js</div>
          </div>
        </footer>
      </main>

      <StrategyModal s={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <span className="text-sm text-muted">{count} strategies</span>
    </div>
  );
}

function MethodItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg bg-bg/50 border border-border p-4">
      <div className="text-sm font-semibold text-accent mb-1">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{desc}</div>
    </div>
  );
}
