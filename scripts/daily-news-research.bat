@echo off
cd /d C:\Users\franz\franzruchti.com
for /f "delims=" %%i in ('powershell -Command "Get-Date -Format yyyy-MM-dd"') do set TODAY=%%i
echo [%TODAY%] News-Recherche gestartet >> scripts\last-run.log

claude -p --model sonnet --dangerously-skip-permissions "Lies die Datei scripts/daily-news-research.txt und fuehre die Anweisungen darin aus. Arbeitsverzeichnis ist C:/Users/franz/franzruchti.com" >> scripts\last-run.log 2>&1

echo [%TODAY%] News-Recherche beendet >> scripts\last-run.log
