# DROGBA and BATISTUTA replay provenance

These replays cover only DROGBA short 81k (24–27 October 2026) and BATISTUTA
long 77k (30 October 2026). Reused historical codenames must not match them.

Sources read from Hostinger on 31 October 2026:
- plans.json: entry thesis, level provenance, pre-entry terms/history.
- live_orders.jsonl: entry acknowledgments, initial protective orders,
  DROGBA breakeven replacement, BATISTUTA exchange close.
- hyper_monitor.log: DROGBA TP1 at 15:10:39 UTC on October 24; partial accounting
  profit 566.40; remaining 60% close at 81,050 on October 27 at 21:31:41 UTC.
- trades.json and plan_outcomes.jsonl: recorded results and exit reasons.
- Binance public klines: BTCUSDT hourly for DROGBA; 15-minute for BATISTUTA.

The adjacent JSON files contain the selected public replay data, not credentials
or complete runtime records. Published HTML files embed that same data.

Result basis is the bot ledger per 1 BTC notional: DROGBA +550.80 / initial risk
2626 = +0.21R; BATISTUTA -151.90 / initial risk 2734 = -0.06R. These are not live
cash P&L. BATISTUTA's actual exchange exit was 77,251 versus ledger exit 77,282.10.
DROGBA's TP1 title gives the target (79,750); its exact execution price is not
asserted by this replay. The monitor's booked partial profit is preserved.

Opening introduction precedes candle playback; levels appear together with
entry for presentation. Intrabar animation is illustrative interpolation; full
wicks appear only at the candle close. No candles play beyond the final event.
The first setup popup morphs into its zone; later events remain above candles.
Two-second event holds, autoplay, restart and slider are retained.
