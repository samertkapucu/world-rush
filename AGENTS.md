# WORLD RUSH — Project Context and Codex Instructions

> This file transfers the essential working context from the owner's long ChatGPT conversation into the repository. It is a distilled project brief, **not a verbatim transcript**. Read it before touching code. The owner's spoken language is Turkish.

## OWNER GOAL AND HOW TO WORK

The owner is a novice Windows developer building **WORLD RUSH**, an original TikTok LIVE interactive 3D racing stream. He has repeatedly had to send screenshots and repeat himself. Avoid giving him endless manual steps or saying "fixed" just because a file compiled.

- **Work directly in the checked-out repo**. Inspect files and run tests, including actual viewport screenshot inspection where feasible. Do not ask the owner to copy code into files when you can edit the files.
- **Fix the problem, not the symptom.** Keep explanations in simple, direct Turkish. When something remains unverified, state so clearly; do not claim the streaming scene is fixed without checking its visual output.
- Deliver the changes as a tested, reviewable commit/pull request or push only if authorized by the owner/workflow. Tell him exactly which files and how to update his Windows local copy.
- Do not assume you can access the user's open TikTok LIVE Studio GUI, run local 127.0.0.1 server on his computer, or browse his private ChatGPT share URL. The GitHub repository contains code; LIVE Studio is installed locally on **his Windows 11 computer**.
- **Never request, print, log, or put account passwords, email passwords, 2FA codes, TikTok cookies, or streaming keys in this repo or in chat.**
- Do not claim to perform asynchronous/background work; finish concrete changes in the active coding session.

## TECHNICAL SETUP

- Repository: `samertkapucu/world-rush`, default branch `main`.
- Main game: `index.html`, self-contained HTML/JavaScript using three.js (ES modules, GLTFLoader, EffectComposer, bloom, OutputPass) and Web Audio.
- `live.html` currently redirects to `index.html?stream=1`.
- Windows local Python web server is started in the game folder:
  `py -m http.server 8000`
  Browser: `http://localhost:8000/index.html` or `http://localhost:8000/live.html`.
- LIVE Studio accepts a **Bağlantı / Link / browser source** URL, which is preferable to display capture so owner can use the PC for other tasks. Current settings configured by owner: sound enabled, custom source resolution **1080 W × 1920 H**, "always active" enabled. Vertical/mobile scene selected.
- `GUNCELLE.cmd` was recently added to download latest main-branch files. Owner may have multiple local folders and stale copies. Download or run updater from the directory that the server actually serves, and reload LIVE Studio's source. Do not assume server automatically sees updates from a different directory.
- TikTok LIVE event connector: `tiktok_live_bridge.py` and `START_TIKTOK_BRIDGE.cmd`. The web game opens a local websocket at port 8765 and reacts to public LIVE comments/gifts. Python bridge must be running separately and connect to actual LIVE; do not represent offline test buttons as real gift events.
- User's TikTok LIVE Studio access was initially denied; **a subsequent screenshot confirmed access was granted** and owner can open the LIVE Studio composer. Focus now on making the game visually broadcast-ready and validating the event bridge. Do not repeat old access-help troubleshooting.

## EXACT CURRENT BUG — TOP PRIORITY

The owner is VERY frustrated because the LIVE Studio preview repeatedly crops/squashes the game, shows black bars, or makes everything unreadably small. Prior conversations had multiple wrong "fixed!" claims. Last screenshots show:

1. TikTok LIVE Studio center has a tall portrait frame with creator/profile/chat UI overlays and a `Bağlantı` browser source.
2. Switching Studio source controls `Sığdır` (Fit), `Doldur` (Fill), `Uzat` (Stretch) led to:
   - square-ish strip of game in middle, with 444px black gaps top and bottom;
   - then a tiny 50px image when source geometry was wrong;
   - then full-width zoom and cut-off text / flags with Fill;
   - after a GitHub 9:16 CSS fix, nearly filling vertically but still **small text and cars, safe-area issues and black space**. Owner explicitly says last screenshot is **NOT correctly, sharply fitted**.
3. **Current repo has attempted 9:16 stream CSS**:
   `#app.stream-mode { width:min(100vw,56.25dvh); height:min(100dvh,177.77778vw); aspect-ratio:9/16; ... }`.
   It sizes the game *within* the browser viewport; if LIVE Studio reports an unusual source/visible viewport or internally transforms the source, there may still be black margins or crops. Inspect this carefully. The source element in LIVE Studio may also have been resized/moved by hand; HTML alone cannot automatically move a source transform in LIVE Studio.
4. Stream HUD design uses **540×960 logical CSS coordinates**, transformed via `--stream-scale` and safe-area padding. Top scoreboard can overlap the road. The audience watches on a phone; important text must remain legible after source is downscaled into TikTok UI.
5. Small 3D cars occupy only a narrow mid/lower band; camera shots spend a lot of time on empty road. Reframe **stream mode only** to enlarge cars while preserving all four lanes, flags, and the right-side TikTok chat safe area. Avoid gratuitous UI clutter and unwanted source zoom.
6. Chrome desktop often shows the page centered as a narrow 9:16 strip. This is normal; **the LIVE Studio output must be exactly 9:16 full frame, without letterboxing/cropping**.
7. Source quality should be sharp, not fuzzy, with 1080×1920 final output and 60fps where feasible. Normal browser desktop supersampling was increased previously; don't cause needless GPU load/double-render.

## REQUIRED TASK FOR CODEX

**Make a single, tested, robust live broadcast source and give the owner precise instructions for TikTok Studio placement.**

- Inspect `index.html` and `live.html`, including all CSS and JavaScript that choose stream mode, scale HUD, size canvas, react to resize, and pick camera positions.
- Prefer a **dedicated, explicit portrait output route** (e.g. `live.html`) with a deterministic full-viewport 9:16 canvas; if a containing viewport is not 9:16, make behavior deliberate and explain it. Ensure in common 1080×1920 and 540×960 viewport sizes the page fills the entire source and all essential HUD is visible, no arbitrary fixed 960px element overflowing after transformations.
- Audit the source's *intrinsic browser dimensions vs. LIVE Studio source transform/scene canvas*. If source is 1080×1920 but displayed letterboxed, explain exactly which LIVE Studio control/transform must be reset, and why. Never choose Fill or Stretch without verifying whether it crops.
- Do not break the existing 3D race, national flags, rotating country leagues, countdown, dynamic camera, Web Audio, 8765 websocket gift bridge or TikTok events.
- Improve readable scoreboard for a phone-width viewing experience. Show four teams and flags clearly, with sufficient contrast. Align within LIVE UI safe zones (TikTok user badge at top left, comment/gift UI along right and bottom).
- Improve the visual focus on cars. Preserve a professional live race look, with four cars easily visible and distinct. Keep all lanes/cars visible during changing camera shots.
- Remove any central sound unlock button from the live broadcast source while still making sound work when allowed; provide honest audio testing steps through LIVE Studio. WebAudio autoplay restrictions may require a real gesture; do not promise audio is captured until tested.
- Create an automated browser-based screenshot/test harness (Playwright or equivalent if possible) for at least 1080×1920, 540×960 and an unusual viewport (e.g. 1080×1080). Visual review, not just JS syntax check. Test at start and during race, verify no overlays cut off.
- Verify all modifications and provide what *was actually tested* vs what still needs LIVE Studio visual confirmation. Keep dependencies realistic.

## GAMEPLAY & LIVE ENGAGEMENT

- Race with four flag-themed 3D cars, changing country leagues including Gulf countries (SA Saudi, AE UAE, KW Kuwait, QA Qatar), crossovers such as Turkey, Brazil, Germany, USA.
- Spectators choose a team by commenting its code (e.g. SA / AE / KW / QA). Joining via comments is free.
- Actual gifts from a viewer who picked a team add time-limited speed boosts; ensure no gift silently assigned to an arbitrary team. Popular examples Rose, Doughnut, Galaxy, Sports Car, Lion, Universe. Gift art should display the genuine TikTok CDN thumbnail if available, with emoji fallback.
- The game must run continuously, auto-restart races, handle LIVE interruptions cleanly, and keep a fair, clear distinction between test/demonstration events and real LIVE gifts.
- An existing TikTok account with LIVE Studio access is being used. Do not hardcode credentials, stream keys, or private account data, and do not assume a particular username is permanently associated with the studio session.

## PRIOR CHANGES / FAILURES TO REMEMBER

- Three.js import used to error ("three" unresolved) until an import map was added. Do not break ES-module package resolution.
- On iPhone Safari, `http://192.168.1.187:8000/index.html` worked on the same Wi-Fi but screen sharing displayed Safari chrome and rotated landscape on TikTok; the owner moved to **PC LIVE Studio browser source** to avoid that. Do not recommend returning to mobile streaming unless asked.
- Sounds were silent on mobile; a tap-to-unlock button and iPhone-audible synth notes were added. PC browser source sound is a separate test.
- A previous screenshot showed a version `v0.5 WIDE CAMERA EDITION` with offline-only gifts; owner later downloaded current `v10`. Avoid relying on old files or stale folders.
- GitHub commits that attempted to fix 9:16 size did not fully resolve actual source positioning in LIVE Studio. The owner explicitly asked for actual edits instead of more toggles and instructions.
- User communicates casually in Turkish, is impatient with repetitive questions, and wants **working results** with minimal instructions. A concise final result in Turkish is preferable.

## HOW TO VALIDATE AND HAND OFF

1. Run and inspect actual code and source markup.
2. Make targeted improvements preserving current behavior and network connector.
3. Perform reproducible automated screenshot checks at 9:16 (including 1080×1920), and inspect screenshot files. If visual testing is unavailable, state exactly that.
4. Keep changes committed and describe how to get them on Windows. Ensure updater does not clobber unsaved work.
5. Give one reliable LIVE Studio instruction sequence: source URL, W/H, fit mode, and **reset transform** / size positioning if required, not a loop of conflicting "Fit/Fill/Stretch" suggestions.
6. Do not declare victory until the owner can inspect a clean full-frame preview.

## SECURITY

Never place any credentials, personal emails, passwords, cookies, session links, one-time codes, RTMP credentials, or private user details into source files or reports. Only game development details belong here.
