import { categories } from '@/lib/strategies';
import { CategorySection } from '@/components/CategorySection';
import { LiveKpi } from '@/components/LiveKpi';

export default function Home() {
  const totalStrategies = categories.reduce(
    (n, c) => n + c.strategies.filter((s) => !s.comingSoon).length,
    0,
  );

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="grid-bg border-b border-edge">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-card/60 px-3 py-1 text-xs text-gray-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            策略组合 · 实时仪表盘 (开发中)
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white">
            量化策略总览
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-400 max-w-2xl">
            目前正在研究与运行的量化交易策略,涵盖技术分析、链上数据、期权、收益与深度学习五大类。
            点击下方任意策略可查看完整的中英文报告。
          </p>

          {/* Top-level KPIs */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            <KpiBox label="策略类别" value={`${categories.length}`} hint="个" />
            <KpiBox label="已上线策略" value={`${totalStrategies}`} hint="个" />
            <KpiBox label="实时数据" value="即将接入" />
            <KpiBox label="语言" value="中 / EN" />
          </div>

          {/* Anchor nav */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full border border-edge bg-panel/60 px-3 py-1.5 text-sm text-gray-300 hover:border-accent/60 hover:text-accent transition-colors"
              >
                {c.titleZh}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Categories */}
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-14">
        <LiveKpi />
        {categories.map((c) => <CategorySection key={c.id} c={c} />)}
      </div>

      {/* Roadmap placeholder for live dashboard */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-dashed border-edge bg-panel/40 p-8 text-center">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="text-xl font-semibold text-white">实时表现追踪 · 即将上线</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            未来本仪表盘将接入实时数据,展示每条策略的持仓、盈亏曲线、最大回撤、夏普比率等核心指标,
            并支持中英文切换与多周期视图。
          </p>
        </div>
      </section>

      <footer className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} 量化策略仪表盘</div>
          <div>构建于 Next.js · Tailwind CSS</div>
        </div>
      </footer>
    </main>
  );
}

function KpiBox({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-edge bg-card/70 px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <div className="text-2xl font-bold text-white">{value}</div>
        {hint ? <div className="text-xs text-gray-500">{hint}</div> : null}
      </div>
    </div>
  );
}
