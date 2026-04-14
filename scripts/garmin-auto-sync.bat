@echo off
:: Garmin Auto-Sync: garmin-givemydata + garmin-sync.mjs
:: Wird vom Task Scheduler alle 4h ausgefuehrt

echo [%date% %time%] Garmin Sync gestartet >> "%USERPROFILE%\garmin-sync.log"

:: 1. Neue Daten von Garmin Connect holen
call garmin-givemydata >> "%USERPROFILE%\garmin-sync.log" 2>&1

:: 2. Daten zu Turso pushen
cd /d "C:\Users\franz\franzruchti.com"
node --env-file=.env.local scripts/garmin-sync.mjs >> "%USERPROFILE%\garmin-sync.log" 2>&1

echo [%date% %time%] Garmin Sync abgeschlossen >> "%USERPROFILE%\garmin-sync.log"
