"""
Push live trade data to the strategy dashboard.

Usage:
    python push_trades.py --strategy nq --trades trades.json
    python push_trades.py --strategy hsi --positions positions.json

Or call from your bot:
    from push_trades import push_live_data
    push_live_data('nq', trades=[...], positions=[...])

Requires: pip install requests
Token: reads from C:\\Users\\siusu\\deribit-key\\github_pat.txt
"""

import json
import base64
import argparse
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    print("pip install requests")
    raise

REPO = "ericfongtrading/strategy-dashboard"
BRANCH = "main"
TOKEN_PATH = Path(r"C:\Users\siusu\deribit-key\github_pat.txt")


def get_token():
    return TOKEN_PATH.read_text().strip()


def push_live_data(strategy_id: str, trades: list = None, positions: list = None):
    """Push trades and positions to the dashboard repo."""
    token = get_token()
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
    }
    file_path = f"data/{strategy_id}.json"
    api_url = f"https://api.github.com/repos/{REPO}/contents/{file_path}"

    # Get current file SHA (needed for updates)
    sha = None
    r = requests.get(api_url, headers=headers)
    if r.status_code == 200:
        sha = r.json()["sha"]
        existing = json.loads(base64.b64decode(r.json()["content"]))
    else:
        existing = {"recentTrades": [], "positions": []}

    # Merge: replace trades/positions if provided, keep existing otherwise
    data = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "recentTrades": trades if trades is not None else existing.get("recentTrades", []),
        "positions": positions if positions is not None else existing.get("positions", []),
    }

    content = base64.b64encode(json.dumps(data, indent=2).encode()).decode()

    payload = {
        "message": f"Update live data: {strategy_id}",
        "content": content,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha

    r = requests.put(api_url, headers=headers, json=payload)
    if r.status_code in (200, 201):
        print(f"Pushed {strategy_id} data successfully")
    else:
        print(f"Error: {r.status_code} {r.text}")


def make_trade(date, direction, entry, exit_price, pnl, pnl_num, r_multiple=None):
    """Helper to build a trade dict."""
    t = {
        "date": date,
        "direction": direction,
        "entry": entry,
        "exit": exit_price,
        "pnl": pnl,
        "pnlNum": pnl_num,
    }
    if r_multiple:
        t["rMultiple"] = r_multiple
    return t


def make_position(symbol, direction, entry, current, size, pnl, pnl_num):
    """Helper to build a position dict."""
    return {
        "symbol": symbol,
        "direction": direction,
        "entry": entry,
        "current": current,
        "size": size,
        "pnl": pnl,
        "pnlNum": pnl_num,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--strategy", required=True, help="Strategy ID (e.g., nq, hsi)")
    parser.add_argument("--trades", help="Path to trades JSON file")
    parser.add_argument("--positions", help="Path to positions JSON file")
    args = parser.parse_args()

    trades = None
    positions = None
    if args.trades:
        trades = json.loads(Path(args.trades).read_text())
    if args.positions:
        positions = json.loads(Path(args.positions).read_text())

    push_live_data(args.strategy, trades=trades, positions=positions)
