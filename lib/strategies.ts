import gcModel from './gcModel.json';
import hsiModel from './hsiModel.json';
import nqModel from './nqModel.json';
import fxModel from './fxModel.json';

export type MonthlyRow = {
  year: number;
  months: (number | null)[];
  ytd: number | null;
  isLive?: boolean;
};

export type Trade = {
  date: string;
  /** Entry date. Optional: when any trade carries one, the table shows
   *  Entered/Exited columns instead of the single Date column. */
  entryDate?: string;
  /** Instrument. Optional: single-market strategies (GC, NQ) omit it and the
   *  table hides the column. Multi-coin strategies must set it, or every row
   *  reads as the same trade. */
  symbol?: string;
  direction: 'Long' | 'Short';
  entry: string;
  exit: string;
  pnl: string;
  pnlNum: number;
  rMultiple?: string;
  /** What the bot learned from this trade (losing trades; from the failure-mode journal). */
  lesson?: string;
  /** Why the trade ended, in a few words. Optional: only strategies whose feed
   *  explains its exits (the Hyper bot) set it, and the column hides otherwise. */
  note?: string;
};

export type Position = {
  symbol: string;
  direction: 'Long' | 'Short';
  entry: string;
  current: string;
  size: string;
  pnl: string;
  pnlNum: number;
  /** Risk detail. All optional and all opt-in per column, so a feed that only
   *  reports mark-to-market (GC, NQ) keeps its existing four-column table. */
  stop?: string;
  targets?: string;
  realized?: string;
  /** Share of the position not yet taken off, e.g. "60%". */
  open?: string;
};

/** A setup that has NOT been entered â€” published before it triggers rather than
 *  reported after it resolves. Only the Hyper bot has these. */
export type Plan = {
  symbol: string;
  direction: 'Long' | 'Short';
  zone: string;
  stop: string;
  targets: string;
  /** 0-5. A conviction label the planner writes; it does not gate execution. */
  conviction?: number;
  status: string;
};

/** A headline number on the card and at the top of the modal, supplied by the
 *  live feed rather than baked in at build time. Used where the standard
 *  CAGR/Sharpe/MaxDD trio would have to be invented to be filled in. */
export type Headline = {
  label: string;
  value: string;
  sub?: string;
  tone?: 'good' | 'bad';
};

export type Strategy = {
  id: string;
  name: string;
  asset: string;
  category: 'tradfi' | 'crypto' | 'ml' | 'research';
  edge: string;
  cagr?: string;
  cagrLabel?: string;
  cagrNum?: number;
  sharpe?: string;
  pf?: string;
  winRate?: string;
  maxDD?: string;
  maxDDNum?: number;
  status: 'live' | 'backtest' | 'active' | 'development';
  statusLabel?: string;
  description: string;
  cardSummary?: string;
  dataSource?: string;
  highlights?: string[];
  pdfEn?: string;
  pdfZh?: string;
  proofUrl?: string;
  proofLabel?: string;
  backtestStart?: number;
  backtestEnd?: number;
  liveStart?: number;
  liveStartMonth?: number;
  monthlyReturns?: MonthlyRow[];
  /** Sum the monthly percentages instead of compounding them. Correct for a
   *  fixed-contract, fixed-capital-base strategy where the position size never
   *  scales with equity â€” compounding those months overstates the curve. */
  additiveEquity?: boolean;
  /** The equity line is a model/signal return stream rather than a broker NAV. */
  equityModelOnly?: boolean;
  /** Override the right-hand label of the equity curve time axis. */
  equityEndLabel?: string;
  /** Draw an underwater (drawdown-from-peak) panel beneath the equity line.
   *  Month-end tables cannot show a drawdown whose peak and trough fall
   *  mid-month; this makes it visible. */
  showUnderwater?: boolean;
  /** Drawdown from peak in percentage points, sampled off the DAILY equity
   *  curve (weekly minima, so troughs survive the downsample). Supply this
   *  wherever the true depth falls between month-ends â€” deriving the panel
   *  from monthly rows alone understates it. */
  underwaterSeries?: number[];
  underwaterLabel?: string;
  /** Footnote rendered under the monthly table. */
  monthlyNote?: string;
  performanceNote?: string;
  modelDataThrough?: string;
  modelCostNote?: string;
  recentTrades?: Trade[];
  positions?: Position[];
  /** Fetch this strategy's live feed on the CARD, not just in the modal, and
   *  render its `headline` block where CAGR/Sharpe would sit. Opt-in so the
   *  front page still makes exactly one network request per live-fed card. */
  liveHeadline?: boolean;
  /** Optional pre-rendered chart image (e.g. signals overlaid on price).
   *  Render with a transparent background for the dark modal. */
  chartImg?: string;
  chartImgLabel?: string;
  /** Extra labelled figures shown beside the headline, for strategies whose key
   *  numbers are not Sharpe / Max DD (e.g. net P&L after hedges, capital). */
  extraMetrics?: { label: string; value: string; tone?: 'good' | 'bad'; modalOnly?: boolean }[];
};

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
const pdf = (p: string) => `${bp}${p}`;

export const strategies: Strategy[] = [
  {
    "id": "hsi",
    "name": "Intraday Multi-Strategy",
    "asset": "HSI Futures",
    "category": "tradfi",
    "edge": "Technical",
    "status": "live",
    "description": "Systematic intraday trading on Hang Seng Index futures. The historical benchmark uses HSI contracts; current live execution uses MHI.",
    "dataSource": "HSI model: 2021 to 30 Oct 2026 | Live: MHI",
    "backtestStart": 2021,
    "backtestEnd": 2026,
    "liveStart": 2026,
    "liveStartMonth": 4,
    "additiveEquity": false,
    "equityModelOnly": true,
    "equityEndLabel": "30 Oct 2026",
    "showUnderwater": true,
    "underwaterLabel": "Daily worst minute-close",
    "highlights": [
      "Historical HSI-contract benchmark from 2021 through 30 October 2026.",
      "Returns retain profits; maximum drawdown includes floating P&L at minute closes.",
      "Actual MHI execution results are separate from this full-size HSI benchmark."
    ],
    "modelCostNote": "HSI model Â· 4-point total round-trip cost allowance",
    "modelDataThrough": "2026-10-30T18:59:00+00:00",
    "cagr": `${(hsiModel.cagr * 100).toFixed(2)}%`,
    "cagrNum": hsiModel.cagr,
    "sharpe": hsiModel.dailySharpe.toFixed(2),
    "maxDD": `-${(hsiModel.maxDD * 100).toFixed(2)}%`,
    "maxDDNum": hsiModel.maxDD,
    "monthlyReturns": hsiModel.monthlyReturns,
    "underwaterSeries": hsiModel.underwaterSeries,
    "monthlyNote": hsiModel.monthlyNote
  },
  {
    "id": "gc",
    "name": "Intraday Momentum",
    "asset": "GC Futures",
    "category": "tradfi",
    "edge": "Technical",
    "status": "live",
    "description": "Systematic momentum trading on COMEX gold futures with a confirmed 4H and daily structure overlay. Historical performance is a current-strategy simulation; live execution uses IB and FTMO.",
    "dataSource": "Backtest: 26 Dec 2019 to 30 Oct 2026 | Live: IB + FTMO",
    "backtestStart": 2019,
    "backtestEnd": 2026,
    "liveStart": 2026,
    "liveStartMonth": 8,
    "additiveEquity": false,
    "equityModelOnly": true,
    "equityEndLabel": "30 Oct 2026",
    "showUnderwater": true,
    "underwaterLabel": "Daily worst minute-close",
    "highlights": [
      "4,387 historical trade legs on corrected inputs through 30 October 2026.",
      "CAGR and monthly returns retain profits; maximum drawdown includes floating P&L at minute closes.",
      "Daily Sharpe uses marked-to-market equity returns; model history is separate from actual broker results."
    ],
    "modelCostNote": "Model returns Â· 1.06 bp assumed round-trip costs",
    "modelDataThrough": "2026-10-30 20:59:00+00:00",
    "cagr": `${(gcModel.cagr * 100).toFixed(2)}%`,
    "cagrNum": gcModel.cagr,
    "sharpe": gcModel.dailySharpe.toFixed(2),
    "maxDD": `-${(gcModel.maxDD * 100).toFixed(2)}%`,
    "maxDDNum": gcModel.maxDD,
    "monthlyReturns": gcModel.monthlyReturns,
    "underwaterSeries": gcModel.underwaterSeries,
    "monthlyNote": gcModel.monthlyNote
  },
  {
    "id": "nq",
    "name": "Five-Sleeve Intraday Portfolio",
    "asset": "NQ Futures",
    "category": "tradfi",
    "edge": "Technical",
    "status": "live",
    "description": "Five-sleeve systematic intraday portfolio on Nasdaq-100 futures, including OSR. Historical results use the approved reference portfolio; current IB and FTMO executions are reported separately.",
    "dataSource": "Backtest: 30 Dec 2020 to 30 Oct 2026 | Live: IB + FTMO",
    "backtestStart": 2020,
    "backtestEnd": 2026,
    "liveStart": 2026,
    "liveStartMonth": 9,
    "additiveEquity": false,
    "equityModelOnly": true,
    "equityEndLabel": "30 Oct 2026",
    "showUnderwater": true,
    "underwaterLabel": "Daily worst minute-close",
    "highlights": [
      "OSR is included alongside the existing four sleeves, using its original exit design.",
      "Monthly returns and the equity curve come from the same five-sleeve model.",
      "Daily Sharpe includes flat weekdays; maximum drawdown includes floating P&L at minute closes."
    ],
    "modelCostNote": "Five-sleeve model Â· stated research trading costs",
    "modelDataThrough": "2026-10-30T20:59:00+00:00",
    "cagr": `${(nqModel.cagr * 100).toFixed(2)}%`,
    "cagrNum": nqModel.cagr,
    "sharpe": nqModel.dailySharpe.toFixed(2),
    "maxDD": `-${(nqModel.maxDD * 100).toFixed(2)}%`,
    "maxDDNum": nqModel.maxDD,
    "monthlyReturns": nqModel.monthlyReturns,
    "underwaterSeries": nqModel.underwaterSeries,
    "monthlyNote": nqModel.monthlyNote
  },
  {
    "id": "fx",
    "name": "Mean Reversion",
    "asset": "FX Pairs",
    "category": "tradfi",
    "edge": "Statistical",
    "status": "live",
    "description": "Systematic FX mean reversion. The historical scoreboard uses the approved reduced-risk research benchmark; current broker execution results are separate.",
    "dataSource": "Model: 2019 to 30 Oct 2026 | Live: IB + FTMO",
    "backtestStart": 2019,
    "backtestEnd": 2026,
    "liveStart": 2026,
    "liveStartMonth": 9,
    "additiveEquity": false,
    "equityModelOnly": true,
    "equityEndLabel": "30 Oct 2026",
    "showUnderwater": true,
    "underwaterLabel": "Four-hour closes",
    "highlights": [
      "Reduced-risk historical research benchmark through 30 October 2026.",
      "Monthly returns retain profits and include floating P&L valued at completed four-hour closes.",
      "Uses proportional transaction costs. IB minimum commissions are excluded; this is not actual IB account performance."
    ],
    "modelCostNote": "Reduced-risk model Â· proportional cost assumption; IB minimum commissions excluded",
    "modelDataThrough": "2026-10-30T21:00:00+00:00",
    "performanceNote": "Reduced-risk research model; IB minimum commissions excluded.",
    "cagr": `${(fxModel.cagr * 100).toFixed(2)}%`,
    "cagrNum": fxModel.cagr,
    "sharpe": fxModel.dailySharpe.toFixed(2),
    "maxDD": `-${(fxModel.maxDD * 100).toFixed(2)}%`,
    "maxDDNum": fxModel.maxDD,
    "monthlyReturns": fxModel.monthlyReturns,
    "underwaterSeries": fxModel.underwaterSeries,
    "monthlyNote": fxModel.monthlyNote
  },
  {
    id: 'options',
    name: 'Options Premium',
    asset: 'BTC Options (Deribit)',
    category: 'crypto',
    edge: 'Volatility',
    cagr: '24%',
    cagrNum: 0.24,
    sharpe: '0.98',
    maxDD: '-9%',
    maxDDNum: 0.09,
    status: 'live',
    liveHeadline: true,
    description: 'Systematic options premium selling on BTC via Deribit, governed by a proprietary cycle-phase regime model with two-tier expiry structure. ALL figures are BTC-denominated  -  pure options alpha, no spot beta. Headline metrics and the monthly table are live performance since Jun 2022, deposit-adjusted (unitized NAV), positions carried per the trading plan; drawdown is stated for the current era (since 2024).',
    dataSource: 'Live since Jun 2022 | all figures BTC-denominated',
    backtestStart: 2021,
    backtestEnd: 2026,
    liveStart: 2022,
    highlights: [
      'Live BTC-NAV since Jun 2022: return, drawdown and Sharpe refresh from the daily feed',
      'Sharpe is annualized from monthly BTC-NAV returns, using Rf = 0%',
    ],
    monthlyReturns: [
      { year: 2022, months: [null, null, null, null, null, 37.1, 2.9, 3.3, 1.1, 2.0, -13.3, 5.8], ytd: 37.8, isLive: true },
      { year: 2023, months: [-8.4, 1.9, 2.0, 3.6, 5.3, 0.9, -3.7, 0.3, -6.3, 13.6, 2.6, 13.5], ytd: 25.4, isLive: true },
      { year: 2024, months: [-5.5, 10.6, 19.6, 3.8, -1.1, 0.0, 2.3, -4.9, 2.0, 6.2, -0.8, -0.7], ytd: 33.1, isLive: true },
      { year: 2025, months: [0.9, -3.7, 0.5, 0.3, -0.6, 0.3, 1.0, -0.1, -0.1, 3.3, -0.7, -0.9], ytd: 0.1, isLive: true },
      { year: 2026, months: [2.7, 4.0, 3.5, 2.1, 1.8, -0.8, 0.6, 1.3, -2.8, -0.6, 0.0, null], ytd: 12.3, isLive: true },
    ],
  },
  {
    id: 'btc-lsr',
    name: 'Long/Short Ratio',
    asset: 'BTC',
    category: 'crypto',
    edge: 'Exchange Data',
    cagr: '26.0%',
    cagrLabel: 'CAGR (since first trade)',
    cagrNum: 0.260,
    sharpe: '1.71',
    maxDD: '-7.2%',
    maxDDNum: 0.072,
    status: 'live',
    description: 'Directional BTC strategy using the coefficient between buyers and sellers to identify regime shifts and market bottoms. Card metrics are the signal record at 40% of equity per signal, unlevered (cash otherwise idle). CAGR is measured from the first signal (Dec 2022); the same curve compounds at 20.2% from Jan 2022 and 16.7% from 2014. Trading live since Apr 2025 - live entries tracked the signals within 0.02-1.2%, verified against exchange order IDs.',
    dataSource: 'Signals: 2022-2026 (4.9 yr) | Live: Apr 2025',
    backtestStart: 2022,
    backtestEnd: 2026,
    liveStart: 2025,
    liveStartMonth: 4,
    highlights: [
      'Entered within days of the Dec-2022 ($16.9K), Sep-2024 ($57K) and Jul-2026 ($60K) lows',
      'Walk-forward validated with bootstrap drawdown analysis',
      'Live entries within 0.02-1.2% of signal price, exchange-order-ID verified',
    ],
    monthlyReturns: [
      { year: 2022, months: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.9], ytd: -0.9 },
      { year: 2023, months: [15.7, 0.0, 13.0, -2.1, 0.0, 0.0, 0.0, -1.1, -1.0, 11.0, 4.0, 3.9], ytd: 50.6 },
      { year: 2024, months: [0.0, 0.0, 0.0, -2.0, 0.0, 0.0, 0.0, 3.6, 3.1, 4.6, 9.8, 0.0], ytd: 20.3 },
      { year: 2025, months: [0.0, 0.0, 0.0, 3.5, 4.8, 1.1, 3.7, 3.4, 0.0, 0.0, 1.6, -1.6], ytd: 17.4, isLive: true },
      { year: 2026, months: [0.0, 0.0, 0.0, 4.7, -1.6, 0.0, 1.9, 10.3, 3.0, -3.4, 0.7, null], ytd: 16.0, isLive: true },
    ],
    positions: [
      { symbol: 'BTC', direction: 'Long', entry: '60,078', current: '61,170', size: '40% eq', pnl: '+1.8%', pnlNum: 1.82 },
    ],
    chartImg: pdf('/charts/btc-lsr-signals-v3.png'),
    chartImgLabel: 'Strategy signals 2022-2026',
  },
  {
    id: 'yield',
    name: 'Automated Yield',
    asset: 'Stablecoins',
    category: 'crypto',
    edge: 'Carry',
    cagr: '10.0%',
    cagrLabel: 'Annualized (live)',
    cagrNum: 0.100,
    status: 'live',
    statusLabel: 'Live',
    description: 'Automated yield-generation strategy on stablecoin balances, earning through short-term, collateralized financing at floating market rates. The system continuously reprices its offers as rate conditions shift and rolls maturing balances automatically, so interest compounds without manual intervention. Returns accrue as interest rather than price movement, with zero directional market exposure - the equity curve only steps upward.',
    dataSource: 'Live: Nov 2025-Present',
    liveStart: 2025,
    liveStartMonth: 11,
    highlights: [
      'Positive every month since inception - returns are accrued interest, not price movement',
      'Runs 24/7 unattended - no scheduled reviews or manual intervention required',
      'Continuously recalibrates offer rates and terms to prevailing market conditions',
      'Interest auto-reinvests as balances roll, compounding the position',
      'Dynamic term structure management',
    ],
    monthlyReturns: [
      { year: 2025, months: [null, null, null, null, null, null, null, null, null, null, 0.45, 0.87], ytd: 1.3, isLive: true },
      { year: 2026, months: [1.13, 1.03, 1.07, 0.75, 0.9, 0.95, 0.87, 0.76, 0.58, null, null, null], ytd: 8.0, isLive: true },
    ],
  },
  {
    id: 'lp-hedged',
    name: 'Hedged AMM LP',
    asset: 'DEX Liquidity Pools',
    category: 'crypto',
    edge: 'AMM LP',
    cagr: '13.8%',
    cagrLabel: 'Net APR (annualized)',
    status: 'live',
    statusLabel: 'Live',
    description: 'AMM liquidity provision on decentralised exchanges, maximised for fee yield and hedged. Capital sits as concentrated liquidity in DEX pools and earns a fee on every swap that trades through its price range. Positions in the most volatile pools are hedged with offsetting short positions sized to the inventory each LP holds, so their returns come from swap fees rather than price direction; lower-volatility pools carry their direction unhedged. Ranges are re-centred when price leaves them, and each pool is capped at a small share of its total liquidity so added capital does not dilute its own fee share. Net P&L is after all hedge gains and losses.',
    dataSource: 'Live since Sep 2026 | updated 2026-11-03',
    highlights: [
      'Marked P&L remains positive after realized and open hedge losses',
      'The portfolio is actively managed through range monitoring, position reductions and equity hedges',
      'Displayed uncollected fees are already included in asset value; they are not cumulative fee earnings',
      'PLTR is approximately neutral-hedged; AMC is partially hedged, while lower-volatility pools carry their direction',
      'Each pool capped at 4% of its liquidity, so new capital does not dilute its own fees',
      'The live sample is far too short to treat the annualized figure as a forecast',
    ],
  },
  {
    id: 'janus',
    name: 'Janus',
    asset: 'Crypto Perps',
    category: 'crypto',
    edge: 'Momentum + Fade',
    cagr: '40.0%',
    cagrNum: 0.400,
    sharpe: '2.39',
    maxDD: '-5.4%',
    maxDDNum: 0.054,
    status: 'live',
    statusLabel: 'Live',
    description: 'Two uncorrelated crypto-perpetual edges netted into one book. A momentum sleeve goes long small-cap perpetuals during funding-heated pumps - crowded, fast-moving setups filtered by a contrarian positioning gate - while a fade sleeve takes the other side of extreme crowd long/short positioning across the top-20 perps by 30-day volume. The two offset: the momentum legs profit from continuation, the fade legs from reversion, so the combined book draws down far less than either sleeve alone (-5.4% max vs -14.5% for the fade sleeve on its own). Fully automated on hourly cycles: momentum legs carry exchange-mounted stops, fade legs exit on signal, and a portfolio circuit breaker caps the account. Figures shown are a survivorship-free, costed backtest; the book is currently paper, with own-funds deployment pending.',
    dataSource: 'Backtest 2023-2026 (3.8 yr, costed) | Live own funds since Nov 2026',
    backtestStart: 2023,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 11,
    highlights: [
      'Two uncorrelated sleeves in one book: a momentum sleeve (long small-cap perps on funding-heated pumps) and a contrarian sleeve (fades extreme top-20 crowd positioning)',
      'The sleeves offset: combined max drawdown -5.4% vs -14.5% for the fade sleeve alone, over 3.8 years',
      'Out-of-sample 2025-2026 (train-only cut): CAGR 51.1%, Sharpe 2.58, max drawdown -5.3%',
      'Survivorship-free backtest: delisted coins included; all fees and actual funding rates deducted',
      '83% of backtest months positive; every calendar year positive',
      'Hedge-aware: a momentum long and a fade short on the same coin are kept as separate positions with separate stops',
      'Fully automated: hourly cycles on a Linux VPS, own exchange account, every cycle reconciled against the exchange',
    ],
    monthlyReturns: [
      { year: 2023, months: [9.4, 1.22, 5.04, -1.23, 0.29, 2.05, 0.78, 4.49, 1.03, 6.86, -0.09, 7.31], ytd: 43.33 },
      { year: 2024, months: [1.33, 4.32, 3.82, 0.84, -0.42, 2.48, 5.55, 1.36, -0.97, 1.29, -0.94, -0.79], ytd: 19.12 },
      { year: 2025, months: [-1.55, 1.68, 2.14, 3.33, 0.71, -0.54, 9.22, 0.64, 5.63, 3.67, 0.91, 0.21], ytd: 28.81 },
      { year: 2026, months: [7.4, 7.56, 2.31, 10.37, 9.97, 5.25, 0.09, 3.81, 1.05, 4.22, null, null], ytd: 65.20 },
    ],
  },
  {
    id: 'hyper-bot',
    cardSummary: "An autonomous AI trading system that builds plans from market data and technical-analysis videos, executes through exchange APIs, and manages positions within predefined risk controls.",
    name: 'Hyper Bot',
    asset: 'BTC Perp',
    category: 'ml',
    edge: 'Machine Learning',
    status: 'active',
    statusLabel: 'Live',
    liveHeadline: true,
    description: 'A closed-loop trading system: it gathers its own data, forms its own views, places and manages its own orders, and audits itself afterwards. Every hour it assembles an eight-section market brief - price and order-flow structure, funding and open interest, ETF flows, aggregate liquidations, multi-timeframe liquidation heatmaps, transcribed analyst commentary, and the current state of its own book - and a reasoning model reads all of it. From that it writes conditional trade plans: direction, entry zone, stop and staged targets, each held behind conditions drawn from a library of 38 signal types that must all be true before anything is sent. When they are, the order fires on Hyperliquid with its stop and take-profits attached, and the system keeps managing the position as the market moves - pulling a stop to breakeven, taking partial profit, revising levels, or closing outright when the reasoning behind the trade stops holding. Every closed trade is then written up: what the thesis was, what actually happened, and what should change. Those post-mortems become standing rules replayed into every future plan, so the system meets each of its mistakes once. Executing live on Hyperliquid since Aug 2026; the record below is kept at a constant 1 BTC notional so every trade in the series stays directly comparable.',
    dataSource: 'Live on Hyperliquid since Aug 2026 | record kept at 1 BTC notional per trade',
    liveStart: 2026,
    liveStartMonth: 6,
    highlights: [
      'Writes its own plans â€” no human sets a direction, an entry, a stop or a target',
      'Nothing fires on a hunch: each plan is gated on conditions from a 38-signal library, and waits until they are all true',
      'Executes and manages on Hyperliquid â€” stop and staged take-profits go on with the entry, then get revised as the market moves',
      'Exits on its own reasoning, not just its stop: a position whose thesis has broken is closed rather than held to be stopped out',
      'Reviews every closed trade in writing and carries the rule forward, so the same mistake is not available to it twice',
      'Runs unattended 24/7 on a VPS, with watchdog alerts to Telegram if any part of the loop stalls',
    ],
    // Fallback only. The live feed (data/hyper-bot.json) replaces this list, the
    // open positions and the headline numbers on every load; this is what shows
    // if raw.githubusercontent cannot be reached.
    recentTrades: [
      { date: '2026-08-24', entryDate: '2026-08-24', direction: 'Short', entry: '77,200', exit: '78,542', pnl: '$-1,342', pnlNum: -1342.4 },
      { date: '2026-08-24', entryDate: '2026-08-23', direction: 'Short', entry: '77,244', exit: '77,680', pnl: '$-436', pnlNum: -436.3 },
      { date: '2026-08-23', entryDate: '2026-08-22', direction: 'Short', entry: '77,421', exit: '77,228', pnl: '$+193', pnlNum: 192.7 },
      { date: '2026-08-19', entryDate: '2026-08-19', direction: 'Short', entry: '65,018', exit: '66,297', pnl: '$-1,279', pnlNum: -1279.1 },
      { date: '2026-08-19', entryDate: '2026-08-10', direction: 'Short', entry: '65,209', exit: '65,216', pnl: '$+899', pnlNum: 898.55 },
    ],
  },

  {
    id: 'box-theory',
    name: 'Box Theory',
    asset: 'Global Equities',
    category: 'research',
    edge: 'Consolidation Breakout',
    status: 'backtest',
    statusLabel: 'Research',
    cagr: '19.3%',
    cagrLabel: 'CAGR vs S&P 11.9% (equal risk)',
    cagrNum: 0.193,
    sharpe: '1.55',
    maxDD: '-13.2%',
    maxDDNum: 0.132,
    cardSummary:
      'A consolidation-breakout edge tested across 15 global equity markets — survivorship-free, held-out walk-forward, costs included.',
    description:
      "Reverse-engineering the filter that lets the S&P 500 beat most active managers, written as an explicit breakout rule and tested across 15 markets (2015–2026). Built survivorship-free (delisted names kept, the top-liquidity basket rebuilt point-in-time), held-out walk-forward, with costs and a liquidity floor. At equal volatility the global book returns 19.3% CAGR vs the S&P 500's 11.9%, with a shallower max drawdown (-13% vs -20%) and higher Sharpe (1.55 vs 1.01), and it defends better in the 2020 and 2022 bear markets. Position sizing and portfolio allocation are the next phase.",
    dataSource: 'Held-out walk-forward 2015–2026 · 15 markets · vs S&P 500 at equal risk',
    backtestStart: 2015,
    backtestEnd: 2026,
    highlights: [
      'All 15 markets net-positive out-of-sample — North America, Europe, Asia-Pacific',
      'Survivorship-free: delisted/dead tickers kept; top-liquidity basket rebuilt point-in-time',
      'Held-out walk-forward re-optimised at 2015 / 18 / 21 / 24 anchors, stitched to one continuous out-of-sample record',
      'Beats the S&P 500 at equal volatility — higher return, shallower drawdown, better bear-market defence',
      'Next: position sizing and portfolio allocation',
    ],
    proofUrl: pdf('/research/box-theory.html'),
    proofLabel: 'Read the full research',
  },

  {
    id: 'candlestick-ta',
    name: 'Candlestick Patterns',
    asset: 'Global Equities',
    category: 'research',
    edge: 'Chart Patterns (TA)',
    status: 'backtest',
    statusLabel: 'Early research',
    cardSummary:
      'Volume-confirmed candlestick breakouts — inside-bar and HZG setups — forward paper-traded across five markets. The chart-pattern complement to the statistical Box Theory work.',
    description:
      "The chart-pattern strand running alongside Box Theory. Two coil-then-break candlestick setups — an inside bar, or two small bars consolidating inside a strong bar (HZG) — are bought on the breakout only when volume surges; the stop sits at the pattern low and winners trail out under rising pivot lows. Tested across US, Hong Kong, Japan, Taiwan and crypto. Early-stage and shown honestly: the backtest edge is survivorship-tilted and has weakened recently, so it is now forward paper-traded for out-of-sample evidence rather than presented as a finished result.",
    dataSource: 'Backtest 2011–2026 · 5 markets · now live forward paper-trade',
    backtestStart: 2011,
    backtestEnd: 2026,
    chartImg: pdf('/charts/candlestick-pattern.svg?v=3'),
    chartImgLabel: 'Patterns, first-run results, and the research roadmap',
    extraMetrics: [
      { label: 'Markets', value: '5' },
      { label: 'Stage', value: 'Forward paper' },
    ],
    highlights: [
      'Two setups — an inside bar, or two bars coiling inside a strong bar (HZG); see the diagram above',
      'Buy the breakout only on a volume surge (VRR ≥ 2.5); stop at the pattern low; winners trail under rising pivot lows',
      'Early-stage: survivorship-tilted backtest, recently weaker — now forward paper-traded for honest out-of-sample proof',
    ],
    proofUrl: 'https://polygontrading.github.io/pattern-signal-dashboard/paper.html#combined',
    proofLabel: 'Live forward tracking',
  },

  {
    id: 'vix-reversal',
    name: 'VIX Reversal Signal',
    asset: 'US Equities · VIX',
    category: 'research',
    edge: 'Statistical',
    status: 'development',
    statusLabel: 'Evaluating',
    description:
      "How I pressure-test an interesting idea I find before trusting or trading it. Worked example: a public VIX-reversal study, with the verify → stress-test → strategy-or-regime process I would run on it.",
    chartImg: pdf('/charts/vix-reversal.svg?v=3'),
    chartImgLabel: 'The source study (QQQ & SPY) + how I vet an external idea',
    highlights: [
      'Start by distrusting it — reproduce every number from the raw data before believing the claim',
      'Stress-test for curve-fitting: other markets, different parameters and thresholds',
      'Make it tradeable — the raw study has no buy/sell or stops, so define detection, entry/exit and risk',
      'Two outcomes: a standalone strategy, or — if drawdown / consistency / trade frequency fall short — a regime filter for other strategies',
      'Status: spotted, not yet verified — shown to illustrate the process, not a result',
    ],
  },
];


