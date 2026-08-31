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
              AI-built systematic strategies across futures, FX, crypto, and options — from
              initial research through backtesting to fully automated live execution.
              Every strategy follows the same rigorous pipeline: research, data,
              backtesting, validation, deployment, monitoring.
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

          {/* Development Pipeline */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">Development Pipeline</h2>
              <p className="text-sm text-muted mt-1">Every strategy follows the same cycle — built with Claude Code from scratch to fully automated execution</p>
            </div>
            <div className="pipeline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
              <PipelineStep
                num="01"
                title="Research & Data"
                items={[
                  'Exchange data feeds, order books, on-chain metrics',
                  'Chart pattern analysis from price history and video study',
                  'Technical indicators, statistical analysis, sentiment signals',
                ]}
              />
              <PipelineStep
                num="02"
                title="Strategy Design"
                items={[
                  'Entry/exit logic, position sizing, risk parameters',
                  'Multi-regime models and adaptive filters',
                  'Trade plans with ATR-normalized R-multiple targets',
                ]}
              />
              <PipelineStep
                num="03"
                title="Backtesting"
                items={[
                  'Walk-forward testing with chronological train/test splits',
                  'Tick-level fill simulation with realistic slippage',
                  'Full trade-by-trade attribution and equity curve analysis',
                ]}
              />
              <PipelineStep
                num="04"
                title="Validation"
                items={[
                  'Permutation null tests (200+ random-entry reps)',
                  'Out-of-sample verification across multiple regimes',
                  'Cost sensitivity at 1x–3x transaction costs, drop-top-N tests',
                ]}
              />
              <PipelineStep
                num="05"
                title="Live Execution"
                items={[
                  'Automated via IB Gateway API, Deribit, CEX and DEX venues',
                  'VPS-deployed 24/7 with server-side bracket orders',
                  'Watchdog recovery, daily fill reconciliation against model',
                ]}
              />
              <PipelineStep
                num="06"
                title="Monitor & Refine"
                items={[
                  'Real-time P&L, drawdown, and exposure monitoring',
                  'Strategy refinement based on live performance data',
                  'New ideas enter the pipeline daily — continuous development',
                ]}
              />
            </div>
          </section>

          {/* Testing & Validation detail */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-bg-card p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Validation Standards</h3>
              <div className="space-y-3">
                <ValidationRow
                  label="Walk-Forward OOS"
                  desc="Rolling out-of-sample windows — no future data leaks into parameter selection"
                />
                <ValidationRow
                  label="Permutation Tests"
                  desc="200+ randomized-entry simulations to confirm the edge is statistically significant, not luck"
                />
                <ValidationRow
                  label="Cost Sensitivity"
                  desc="Strategies must remain profitable at 1x–3x realistic transaction costs including slippage"
                />
                <ValidationRow
                  label="Concentration Check"
                  desc="Drop-top-N tests ensure returns are not driven by a few outlier trades"
                />
                <ValidationRow
                  label="Lag & Look-Ahead"
                  desc="Systematic checks for data leakage — every signal uses only information available at the time"
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-bg-card p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Infrastructure</h3>
              <div className="space-y-3">
                <ValidationRow
                  label="Execution"
                  desc="IB Gateway API for futures and FX, Deribit for BTC options, CEX/DEX for crypto spot and perps"
                />
                <ValidationRow
                  label="Deployment"
                  desc="VPS-hosted 24/7 automated trading with server-side stops, OCA brackets, and auto-reconnect"
                />
                <ValidationRow
                  label="Risk Controls"
                  desc="Portfolio-level drawdown limits, per-strategy position caps, cross-asset correlation monitoring"
                />
                <ValidationRow
                  label="Reconciliation"
                  desc="Daily automated fill-vs-model reconciliation — every live trade verified against the signal log"
                />
                <ValidationRow
                  label="Development"
                  desc="Built with Claude Code — AI-assisted from data collection to code generation to live deployment"
                />
              </div>
            </div>
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

function PipelineStep({ num, title, items }: { num: string; title: string; items: string[] }) {
  return (
    <div className="bg-bg-card p-5 md:p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-accent/60">{num}</span>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-muted leading-relaxed flex gap-2">
            <span className="text-accent/40 mt-0.5 shrink-0">&#x25B8;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ValidationRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-accent/50" />
      <div>
        <div className="text-sm font-medium text-white/90">{label}</div>
        <div className="text-xs text-muted leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
