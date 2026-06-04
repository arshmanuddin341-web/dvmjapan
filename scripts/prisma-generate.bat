@echo off
echo Stopping Node processes so Prisma can update the client...
taskkill /IM node.exe /F 2>nul
timeout /t 2 /nobreak >nul
cd /d "%~dp0.."
echo Running prisma generate...
call npx prisma generate
echo.
echo Done. You can start the dev server again (npm run dev).
if "%1"=="" pause
