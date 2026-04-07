@echo off
title BethMedic Dev Server
echo.
echo ============================================
echo   BethMedic - Medical E-Commerce Platform
echo ============================================
echo.
echo Starting development server...
echo.
cd /d "%~dp0"
npm run dev
pause
