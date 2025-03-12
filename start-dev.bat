@echo off
REM Batch file to start the development server

cd /d %~dp0
echo Starting Qualia Solutions development server...
npm run dev
pause 