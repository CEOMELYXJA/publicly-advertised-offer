@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 24 ou plus recent est requis. Consultez LISEZ-MOI.md.
  pause
  exit /b 1
)
echo.
echo Radar Gratuit demarre. Ouvrez http://127.0.0.1:3210 dans votre navigateur.
echo Gardez cette fenetre ouverte pendant l'utilisation et la surveillance.
echo Pour arreter, fermez la fenetre ou appuyez sur Ctrl+C.
echo.
node server.js
pause
