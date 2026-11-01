# Dashboard performance records

Read the current branch before updating this dashboard. Preserve unrelated
strategy objects and current components; whole-file copies from an older
checkout can revert already published figures and chart behavior.

The approved traditional-finance historical models are in `lib/gcModel.json`,
`lib/hsiModel.json`, `lib/nqModel.json` and `lib/fxModel.json`. Each model supplies
the headline metrics, high-precision monthly returns and drawdown series together.
Use the same model for the card, modal, monthly table and equity chart. Compound
these retained-equity monthly returns. Preserve their period and cost notes.

Historical models and actual broker fills served from `data/*.json` are different
records. A live-feed refresh must not overwrite a historical model's monthly
table or label simulated months as actual live returns.

The FX reduced-risk model excludes IB minimum commissions. Keep that limitation
visible on its card and inside the modal. HSI history uses the full-size HSI
benchmark; live execution remains MHI. Publishing a benchmark does not change
any bot's execution instrument or order size.

Keep account identifiers, account balances, reference funding amounts, API keys,
raw licensed price data and private sizing details out of this public repository.
Run `node scripts/verify-performance-models.mjs` and the production build after
changing these performance records.
