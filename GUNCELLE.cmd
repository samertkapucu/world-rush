@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title WORLD RUSH - UPDATE
echo.
echo ==============================================
echo  WORLD RUSH - ONE CLICK UPDATE
echo ==============================================
echo.
if not exist "index.html" (
 echo ERROR: index.html not found in this folder.
 echo Put GUNCELLE.cmd next to your WORLD RUSH index.html.
 pause
 exit /b 1
)
echo Downloading the latest WORLD RUSH from GitHub...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; $stamp=Get-Date -Format 'yyyyMMdd-HHmmss-fff'; $base='https://raw.githubusercontent.com/samertkapucu/world-rush/main/'; $files=@('index.html','live.html','supporters.html','tiktok_live_bridge.py','START_TIKTOK_BRIDGE.cmd','requirements-live.txt'); try { foreach($file in $files) { $tmp=$file+'.update-tmp'; Invoke-WebRequest -Uri ($base+$file+'?t='+[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -OutFile $tmp; if((Get-Item -LiteralPath $tmp).Length -lt 20) { throw ('Empty download: '+$file) }; if(Test-Path -LiteralPath $file) { Copy-Item -LiteralPath $file -Destination ($file+'.'+$stamp+'.old') -Force }; Move-Item -LiteralPath $tmp -Destination $file -Force; Write-Host ('Updated: '+$file) -ForegroundColor Green }; Write-Host 'DONE! Refresh the TikTok LIVE Studio Link source.' -ForegroundColor Cyan } catch { Write-Host ('ERROR: '+$_.Exception.Message) -ForegroundColor Red; exit 1 }"
if errorlevel 1 (
 echo.
 echo Update failed. Existing files are backed up with a timestamp and .old suffix if replaced.
 pause
 exit /b 1
)
echo.
echo Refresh your TikTok LIVE Studio Link source.
echo If a bridge is running, restart it after updating.
echo.
pause
