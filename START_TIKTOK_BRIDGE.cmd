@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo   WORLD RUSH - LOCAL TIKTOK LIVE BRIDGE
echo ============================================
echo.
set /p STREAMER=TikTok LIVE username [worldrush.live] - press Enter to keep: 
if "%STREAMER%"=="" set "STREAMER=worldrush.live"
if "%STREAMER%"=="" (
  echo TikTok username is required.
  pause
  exit /b 1
)
echo.
echo Installing dependencies (first run may take a little time)...
py -m pip install -r requirements-live.txt
if errorlevel 1 (
  echo Package install failed. Check Python and internet connectivity.
  pause
  exit /b 1
)
echo.
echo Start your own TikTok LIVE first, and keep this window open.
echo Press Ctrl+C to stop the bridge.
py tiktok_live_bridge.py --user "%STREAMER%"
if errorlevel 1 echo Bridge stopped or could not connect; see messages above.
pause
