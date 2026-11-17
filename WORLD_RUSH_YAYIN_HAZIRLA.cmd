@echo off
setlocal
cd /d "%~dp0"
title WORLD RUSH - LIVE Studio Setup
echo =====================================================
echo   WORLD RUSH - 9:16 TikTok LIVE Source
echo =====================================================
echo.
powershell -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://localhost:8000/index.html' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) {exit 0}; exit 1 } catch {exit 1}"
if errorlevel 1 (
 echo Starting WORLD RUSH server on localhost:8000...
 where py >nul 2>nul
 if errorlevel 1 (
   start "WORLD RUSH SERVER" cmd /k "python -m http.server 8000"
 ) else (
   start "WORLD RUSH SERVER" cmd /k "py -m http.server 8000"
 )
 timeout /t 3 /nobreak >nul
) else (
 echo Local server is already running.
)
echo.
echo http://localhost:8000/live.html|clip
echo LIVE URL COPIED TO CLIPBOARD:
echo http://localhost:8000/live.html
echo.
echo TikTok LIVE Studio:
echo 1. Kaynak ekle -- Baglanti / Link (Web sayfasi)
echo 2. Ctrl+V for the URL
echo 3. Set custom resolution to 1080 x 1920
echo 4. Reset crop and transform, then Fit to the 1080 x 1920 portrait canvas.
echo 5. Center the source at X=0 Y=0 and save the scene.
echo.
echo No browser window crop is needed.
echo If your LIVE Studio has no Link source, run START_WORLD_RUSH_PORTRAIT.cmd
echo then capture only that borderless Chrome app window.
echo.
echo For TikTok comments and real gifts, ALSO run START_TIKTOK_BRIDGE.cmd
echo and sign in to a LIVE-eligible account in TikTok LIVE Studio.
echo.
pause
