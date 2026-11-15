# WORLD RUSH — TikTok LIVE integration test

This is a **local opt-in test connector**, not an official TikTok-certified app. It relies on the unofficial [TikTokLive Python client](https://github.com/isaackogan/TikTokLive) and can stop working if TikTok changes its protocols. **The game has not been connected to a real account by ChatGPT.**

## First-time setup (Windows)

1. Open the repository folder on the computer that runs WORLD RUSH. The GitHub auto-updater should have downloaded the new files.
2. Start your own TikTok LIVE on an account eligible to stream. Open `http://localhost:8000/index.html`.
3. Double-click `START_TIKTOK_BRIDGE.cmd`. Enter the TikTok LIVE username (without @). Keep the terminal running.
4. In WORLD RUSH press `P`. Status should show **BRIDGE CONNECTED** and TikTok LIVE **ONLINE**, when both links succeed.
5. From a second account, comment the exact country code shown above the race, e.g. `SA`, `AE`, `KW` or `QA`. A gift from that account applies to its selected team if the event includes a positive value. Other comments have no race effect.
6. Press `P` again to hide the operator panel before streaming. If a second account isn't available, use **TEST ROSE / TEST GALAXY / TEST LUXURY** in the panel. Test events do not count as genuine support or money.

The connector listens only at `127.0.0.1:8765`; it doesn't ask for your TikTok password or session cookie. Never expose the relay port to the internet.

## Gift-to-boost matrix — initial playtest design

These are **experimental game thresholds using event gift metadata points**, not official prices or guaranteed creator revenue. TikTok gift catalogs, prices, and metadata vary by region. Before monetized use, validate actual gift points against the account's LIVE gift picker.

| Metadata points per gift | Race effect (base) | Visual |
| --- | --- | --- |
| 1–9 | 0.65 s boost | Small spark |
| 10–99 | 1.2 s boost | Pulse |
| 100–999 | 2.25 s boost | Turbo |
| 1,000–9,999 | 4 s boost | Super turbo |
| 10,000+ | 6.5 s boost | 3.3 s car spotlight + legend animation |

- Regardless of gift price, a car's total active boost is capped at **10 seconds**.
- Trailing teams at least 12 m behind get the preexisting **1.25× comeback** multiplier.
- Gift streaks use their final event once. Repeated gifts have a diminishing return; a large gift **never instantly ends the race**.
- During countdown/results no new boost is granted; the gift is acknowledged.
- A gift without a previously chosen country (comment) is acknowledged but **does not secretly select a team**. The top UI discloses how to choose.
- Never manufacture gift notifications, imply a guaranteed win, or pressure viewers to spend.

## Limits

- The Python library is unofficial. For an approved commercial integration investigate [TikTok LIVE Interactive Games partner registration](https://cp-game.tiktok.com/interactive-game-registration).
- LIVE must be available to the broadcasting account in their region. The TikTok bridge may fail while the account isn't LIVE or if public events are inaccessible.
- `diamond_count` may be the metadata field provided by TikTokLive, **not a Coin purchase price**. Hence the game calls its total *gift points*, never dollars or Coins.
- Browser renderer is served over HTTP localhost. If running on a separate machine, this local bridge connection does not work without an authenticated architecture.
- A working WebSocket bridge means **the local connector is reachable**, not necessarily that TikTok LIVE itself is connected.

## OBS / TikTok LIVE Studio

Capture only the browser game area at 9:16 (portrait). Test the safe-zone overlay with `T`, then hide it before LIVE. If background audio is enabled with `M`, check application audio capture separately. Do a short private or unlisted test **only if your account/platform actually offers it** before public streaming.
