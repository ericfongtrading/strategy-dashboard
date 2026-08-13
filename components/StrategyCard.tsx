import type { Strategy } from '@/lib/strategies';

const toneColor: Record<NonNullable<Strategy['tone']>, string> = {
  good: 'text-good',
  bad: 'text-bad',
  neutral: 'text-gray-200',
};

export function StrategyCard({ s }: { s: Strategy }) {
  if (s.comingSoon) {
    return (
      <div className="card-glow rounded-2xl border border-dashed border-edge bg-card/40 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
        <div className="text-4xl mb-3 opacity-50">⏳</div>
        <div className="text-lg font-semibold text-gray-300">{s.nameZh}</div>
        <div className="text-xs text-gray-500 mt-1">{s.nameEn}</div>
        <p className="text-sm text-gray-500 mt-3">{s.description}</p>
      </div>
    );
  }

  const tone = toneColor[s.tone ?? 'neutral'];

  return (
    <div className="card-glow rounded-2xl border border-edge bg-card p-6 flex flex-col gap-4 hover:border-accent/60 transition-colors">
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-white">{s.nameZh}</h3>
          {s.isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-good/10 border border-good/40 px-2 py-0.5 text-xs text-good shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-good opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-good"></span>
              </span>
              {s.liveLabel || '实盘'}
            </span>
          ) : null}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{s.nameEn}</div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed min-h-[3rem]">
        {s.description}
      </p>

      <div className="flex items-end gap-6">
        <div>
          <div className="text-xs text-gray-500">{s.kpiLabel}</div>
          <div
            className={`text-3xl font-bold tracking-tight ${tone}`}
            data-live-kpi={s.liveKey ? `${s.liveKey}:pnl` : undefined}
          >
            {s.kpiValue}
          </div>
        </div>
        {s.subKpiLabel ? (
          <div>
            <div className="text-xs text-gray-500">{s.subKpiLabel}</div>
            <div
              className="text-xl font-semibold text-gray-200"
              data-live-kpi={s.liveKey ? `${s.liveKey}:trades` : undefined}
            >
              {s.subKpiValue}
            </div>
          </div>
        ) : null}
        {s.deployedLabel ? (
          <div>
            <div className="text-xs text-gray-500">{s.deployedLabel}</div>
            <div className="text-xl font-semibold text-gray-200">{s.deployedValue}</div>
          </div>
        ) : null}
      </div>

      {s.liveKey ? (
        <div className="text-xs text-gray-500 -mt-2">
          数据更新于{' '}
          <span data-live-kpi={`${s.liveKey}:updated`}>{s.updatedDisplay ?? '—'}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-2 mt-auto">
        {s.pdfZh ? (
          <a
            href={s.pdfZh}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/30 px-3 py-1.5 text-sm text-accent hover:bg-accent/20 transition-colors"
          >
            <span>{s.pdfZhIcon || '📄'}</span> {s.pdfZhLabel || '中文报告'}
          </a>
        ) : null}
        {s.pdfEn ? (
          <a
            href={s.pdfEn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent2/10 border border-accent2/30 px-3 py-1.5 text-sm text-accent2 hover:bg-accent2/20 transition-colors"
          >
            <span>{s.pdfEnIcon || '📄'}</span> {s.pdfEnLabel || 'English'}
          </a>
        ) : null}
        {s.liveDashboardUrl ? (
          <a
            href={s.liveDashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-good/10 border border-good/40 px-3 py-1.5 text-sm text-good hover:bg-good/20 transition-colors"
          >
            <span>📊</span> 实时交易
          </a>
        ) : null}
        {s.tradesUrl ? (
          <a
            href={s.tradesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <span>{s.tradesIcon || '📈'}</span> {s.tradesLabel || '实盘成交记录'}
          </a>
        ) : null}
      </div>
    </div>
  );
}
