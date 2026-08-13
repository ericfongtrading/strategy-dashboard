import type { Category } from '@/lib/strategies';
import { StrategyCard } from './StrategyCard';

export function CategorySection({ c }: { c: Category }) {
  return (
    <section id={c.id} className="scroll-mt-20">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">{c.titleZh}</h2>
          <div className="text-sm text-gray-500 mt-0.5">{c.titleEn}</div>
        </div>
        <div className="text-sm text-gray-400 max-w-xl">{c.blurb}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {c.strategies.map((s) => <StrategyCard key={s.id} s={s} />)}
      </div>
    </section>
  );
}
