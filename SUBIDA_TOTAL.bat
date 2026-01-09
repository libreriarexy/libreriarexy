@echo off
setlocal enabledelayedexpansion

echo =========================================
echo    LIBRERIA REXY - SUBIDA AUTOMATICA
echo =========================================
echo.

:: Obtener fecha y hora para el mensaje de commit
set "timestamp=%date% %time%"

echo [+] Preparando archivos...
git add .

echo [+] Guardando cambios (Commit)...
git commit -m "Auto-update: %timestamp%"

echo [+] Subiendo a GitHub (main)...
git push origin main

echo.
echo =========================================
echo    ¡LISTO! Los cambios estan en camino.
echo    Vercel actualizara la web en 1 minuto.
echo =========================================
echo.
pause
