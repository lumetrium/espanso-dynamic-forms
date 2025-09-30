@echo off
cd /d "%~dp0"
set FORM_CONFIG=%1
set VITE_QUIET=1
npm run -s dev
