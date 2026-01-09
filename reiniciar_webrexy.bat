@echo off
TITLE WebRexy Server
color 0A

echo ==========================================
echo      REINICIANDO WEBREXY (LIBRERIA)
echo ==========================================
echo.

:: 1. Intentar liberar el puerto 3000 si está ocupado
echo [1/3] Verificando puertos ocupados...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo       - Cerrando proceso en puerto 3000 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Pequeña pausa para asegurar liberación
timeout /t 2 >nul

:: 2. Instalar dependencias si faltan
if not exist "node_modules" (
    echo [2/3] Instalando dependencias por primera vez...
    call npm install
) else (
    echo [2/3] Dependencias listas.
)

:: 3. Iniciar Servidor
echo [3/3] Iniciando servidor de desarrollo...
echo.
echo ------------------------------------------
echo    La web estara lista en unos segundos
echo    Accede a: http://localhost:3000
echo ------------------------------------------
echo.

call npm run dev

pause
