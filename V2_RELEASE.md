# WORLD RUSH V2

Backup: `backup/pre-world-rush-v2` at `a3ea5a340b2ec10e151cac3bb918b9519d91b1de`.

LIVE Studio sources: main game `http://localhost:8000/live.html`; optional transparent thanks overlay `http://localhost:8000/supporters.html`. Add both as separate 1080×1920 browser sources. The 10-minute supporter board is disabled by default; enable only when wanted with `supporters.html?leaderboard=1`. It counts only `diamond_count` when available and never represents revenue or coin value.

Start the single local Python server in the game folder: `py -m http.server 8000 --bind 127.0.0.1`. Start the existing bridge separately: `py tiktok_live_bridge.py --user "your-current-username"`. Both sources listen to the same bridge. Real TikTok LIVE and Studio audio still need verification on the owner's Windows PC.

The game records real gift events for connection diagnostics only. Gifts do not change cars, boosts or results. Team choice is free via a comment with a code shown on screen. The backup branch retains the previous design and should not be put back on air automatically. To restore locally, fetch and check out `backup/pre-world-rush-v2` deliberately. `GUNCELLE.cmd` downloads the current main branch.

Arena visuals use bounded reusable Three.js geometry. Eight themes change sky, fog, lights, roadside 3D shapes and skyline. No 3D geometry is added during a race transition. Theme order cycles without repeating adjacent rounds. Race time and a common pace factor rotate together, so all four countries in one race share the same timing rules.

Verification: `npm run test:live -- --themes-only` simulates 20 arena transitions, `npm run test:live` checks 1080×1920, 540×960 and square viewports, and `node tests/supporters.cjs` checks transparency and event deduplication. These use mocked local TikTok events; a real TikTok account and LIVE Studio are not exercised here.
