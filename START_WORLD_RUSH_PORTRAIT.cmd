@echo off
setlocal
set "URL=http://localhost:8000/live.html"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
echo WORLD RUSH - Clean 9:16 game window (fallback for LIVE Studio)
if not exist "%CHROME%" (
  echo Google Chrome not found. Opening default browser.
  start "" "%URL%"
) else (
  start "" "%CHROME%" --app="%URL%" --window-size=560,995 --window-position=80,40
)
echo Game URL: %URL%
echo In TikTok LIVE Studio select Window Capture and this clean app window.
echo The browser must run Python http.server from the WORLD RUSH folder first.
pause
