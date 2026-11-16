@echo off
rem Double-clickable front end for inbox-setup.ps1.
rem
rem   No arguments  -> interactive menu (this is what a double-click gives you).
rem   Any argument  -> passed straight to the .ps1, no menu and no pause, so the
rem                    terminal workflow stays scriptable.
rem
rem The logic lives in inbox-setup.ps1; this file only dispatches.

setlocal EnableExtensions
title Sifu inbox setup

set "PS1=%~dp0inbox-setup.ps1"

if not exist "%PS1%" (
    echo.
    echo   Could not find inbox-setup.ps1 next to this file.
    echo   Keep both files together in the scripts folder.
    echo.
    pause
    exit /b 1
)

if not "%~1"=="" goto :run_args

:menu
echo.
echo   Sifu Moveset Editor - bug report inbox
echo   ======================================
echo.
echo   1  Check status              (read-only, changes nothing)
echo   2  Get a new unlock link     (replaces the current link)
echo   3  Open the inbox in a browser
echo   0  Exit
echo.
set "choice="
set /p "choice=Choose: "

if "%choice%"=="1" goto :status
if "%choice%"=="2" goto :recover
if "%choice%"=="3" goto :open
if "%choice%"=="0" goto :done
if "%choice%"=="" goto :done
goto :menu

:status
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
goto :menu

:recover
echo.
echo   This deletes the stored unlock link and issues a new one.
echo   The link you saved stops working immediately, and ADMIN_TOKEN
echo   is replaced by a freshly generated value that is never shown.
echo   Use it when the link expired or was lost.
echo.
set "ok="
set /p "ok=Continue? [y/N] "
if /i not "%ok%"=="y" goto :menu
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Setup -BreakGlass -Rotate -Force
echo.
echo   Copy the link printed above now - it is not shown again.
echo   Scroll up if the menu has moved it off screen.
echo.
pause
goto :menu

:open
start "" "https://charlestiudev.qzz.io/admin/reports"
goto :menu

:run_args
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" %*
exit /b %ERRORLEVEL%

:done
endlocal
exit /b 0
