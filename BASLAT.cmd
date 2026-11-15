@echo off
cd /d "%~dp0"
start "" "http://localhost:8000/index.html"
py -m http.server 8000
if errorlevel 1 (
 echo.
 echo Sunucu baslatilamadi. Port 8000 baska bir pencerede acik olabilir.
 pause
)
