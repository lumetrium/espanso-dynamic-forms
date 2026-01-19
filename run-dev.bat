@echo off
cd /d "%~dp0"
set FORM_CONFIG=%1
set SHOW_TIMING=%2
npm run -s dev
