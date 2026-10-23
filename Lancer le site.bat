@echo off
chcp 65001 >nul
title Auto Rent - serveur local
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serveur.ps1"
pause
