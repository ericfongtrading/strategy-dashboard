export type Strategy = {
  id: string;
  nameZh: string;
  nameEn: string;
  /** Short description shown on the card (Simplified Chinese). Edit freely. */
  description: string;
  /** Headline KPI label, e.g. "年化回报". */
  kpiLabel: string;
  /** Headline KPI value, e.g. "25%". */
  kpiValue: string;
  /** Optional secondary KPI (e.g. Sharpe, win rate). */
  subKpiLabel?: string;
  subKpiValue?: string;
  /** Tone of headline KPI for color. */
  tone?: 'good' | 'bad' | 'neutral';
  pdfEn?: string;
  pdfZh?: string;
  /** Optional overrides for the link button labels and icons (default: "📄 中文报告" / "📄 English"). */
  pdfZhLabel?: string;
  pdfEnLabel?: string;
  pdfZhIcon?: string;
  pdfEnIcon?: string;
  /** Optional link to a live/real-time trading dashboard for this strategy
   *  (rendered as a 实时交易 button on the card). */
  liveDashboardUrl?: string;
  /** If true, shows a green pulsing "实盘" (live) badge next to the strategy name. */
  isLive?: boolean;
  /** Optional override for the live badge text (default "实盘"). */
  liveLabel?: string;
  /** Optional third metric, e.g. capital deployed. */
  deployedLabel?: string;
  deployedValue?: string;
  /** Optional link to a verified trade-history page (screenshots of real fills).
   *  Rendered as a distinct button on the card. */
  tradesUrl?: string;
  tradesLabel?: string;
  tradesIcon?: string;
  /** If true, render as a placeholder "coming soon" card. */
  comingSoon?: boolean;
  /** Marks this card's KPIs as live-patchable by <LiveKpi>. The value is the key
   *  prefix used in data-live-kpi attributes, e.g. 'model-1' -> 'model-1:pnl'.
   *  Without it the card keeps whatever the build baked in. */
  liveKey?: string;
  /** Build-time value for the "数据更新于" line; replaced client-side when live. */
  updatedDisplay?: string;
};

export type Category = {
  id: string;
  titleZh: string;
  titleEn: string;
  blurb: string;
  strategies: Strategy[];
};

// Use the basePath at runtime so PDF links work both locally and on GitHub Pages.
const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
const pdf = (p: string) => `${bp}${p}`;

export const categories: Category[] = [
  {
    id: 'technical',
    titleZh: '技术分析策略',
    titleEn: 'Technical Analysis Strategies',
    blurb: '基于价格行为、形态识别与技术指标构建的系统化交易策略。',
    strategies: [
      {
        id: 'ta-composite',
        nameZh: 'TA 综合策略',
        nameEn: 'TA Composite',
        description:
          '五条低相关策略在同一账户上运行，综合多种技术指标。' +
          '回测期 2017-2026（8.8 年）逐年均为正收益，' +
          '8.8 年最大回撤仅 -13.0%。' +
          '交易所挂载止损 + 组合层熔断，已扣除手续费与资金费率。(更新: 2026-08-05)',
        kpiLabel: '年化回报',
        kpiValue: '+26.5%',
        subKpiLabel: '夏普比率',
        subKpiValue: '1.67',
        tone: 'good',
        pdfEn: pdf('/pdfs/technical/ta_composite_EN.pdf'),
        pdfZh: pdf('/pdfs/technical/ta_composite_ZH.pdf'),
        isLive: true,
        liveLabel: '实盘 · 小资金测试中',
        deployedLabel: '测试金额',
        deployedValue: '$10,000',
      },
    ],
  },
  {
    id: 'onchain',
    titleZh: '链上数据策略',
    titleEn: 'On-Chain Data Strategies',
    blurb: '通过区块链原生数据洞察大额资金动向,先于市场捕捉信号。',
    strategies: [
      {
        id: 'btc-lsr',
        nameZh: 'BTC 多空持仓比',
        nameEn: 'BTC Long/Short Ratio',
        description: '近 3 年累计 +125%,最差年份 −5%。',
        kpiLabel: '年化回报',
        kpiValue: '31%',
        subKpiLabel: '3 年累计',
        subKpiValue: '+125%',
        tone: 'good',
        pdfEn: pdf('/pdfs/onchain/btc_lsr_EN.pdf'),
        pdfZh: pdf('/pdfs/onchain/btc_lsr_ZH.pdf'),
        isLive: true,
        deployedLabel: '已投入资金',
        deployedValue: '$184,316',
      },
    ],
  },
  {
    id: 'options',
    titleZh: '期权交易策略',
    titleEn: 'Options Trading Strategies',
    blurb: '基于期权定价、波动率结构的衍生品策略。',
    strategies: [
      {
        id: 'btc-deribit',
        nameZh: 'BTC Deribit 期权',
        nameEn: 'BTC Deribit Options',
        description: '系统化卖出 BTC 期权, 以 BTC 积累为目标。最大回撤仅 8%。',
        pdfEn: pdf('/pdfs/options/btc_deribit_EN.pdf'),
        pdfZh: pdf('/pdfs/options/btc_deribit_ZH.pdf'),
        kpiLabel: '5 年累计 (BTC)',
        kpiValue: '+338%',
        subKpiLabel: 'USD 含币价',
        subKpiValue: '+433%',
        tone: 'good',
        isLive: true,
        deployedLabel: '账户净值',
        deployedValue: '$183,768',
      },
    ],
  },
  {
    id: 'yield',
    titleZh: '收益策略',
    titleEn: 'Yield Strategies',
    blurb: '通过资金利率市场获取稳定的美元收益。',
    strategies: [
      {
        id: 'usd-yield',
        nameZh: '美元收益策略',
        nameEn: 'USD Yield Strategy',
        description:
          '全自动美元资金利率机器人，24 小时循环运作，动态管理期限结构。' +
          '目标年化收益 10-15%。(更新: 2026-08-10)',
        kpiLabel: '实际年化收益率',
        kpiValue: '13.59%',
        subKpiLabel: '累计收益',
        subKpiValue: '$12,821',
        tone: 'good',
        isLive: true,
        deployedLabel: '账户净值',
        deployedValue: '$212,821',
      },
    ],
  },
  {
    id: 'dl',
    titleZh: '深度学习策略',
    titleEn: 'Deep Learning Strategies',
    blurb: '利用深度学习模型挖掘非线性特征,构建预测信号。',
    strategies: [
      {
        id: 'model-1',
        nameZh: 'Model 1',
        nameEn: 'Model 1',
        description:
          'AI 深度学习驱动的 BTC 波段交易系统。持续学习技术分析视频、交易所实时数据、图表形态及历史交易记录,自动生成并管理交易计划。系统记录每笔交易决策,复盘得失并持续优化——随着交易经验的积累不断进化。',
        kpiLabel: '累计盈亏 (模拟)',
        kpiValue: '+$3,731',
        subKpiLabel: '交易记录',
        subKpiValue: '18 笔',
        tone: 'good',
      },
      {
        id: 'dl-more',
        nameZh: '更多策略即将上线',
        nameEn: 'More to come',
        description: '深度学习模型与特征工程正在搭建中。',
        kpiLabel: '',
        kpiValue: '',
        comingSoon: true,
      },
    ],
  },
];
