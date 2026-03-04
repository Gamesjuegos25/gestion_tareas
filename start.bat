@echo off
REM start.bat - Alternative simple starter for Windows (non-PowerShell)
REM Just run this .bat file and it will:
REM 1) Check if Node is installed
REM 2) Install dependencies
REM 3) Build and run the server

echo.
echo ========================================
echo Instalador - Task Filter App
echo ========================================
echo.

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no encontrado. 
    echo Descarga e instala Node.js desde https://nodejs.org/
    echo Luego vuelve a ejecutar este archivo.
    pause
    exit /b 1
)

echo Node encontrado: 
node --version
echo npm encontrado:
npm --version

echo.
echo Instalando dependencias npm...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install falló
    pause
    exit /b 1
)

echo.
echo Compilando TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: npm run build falló
    pause
    exit /b 1
)

echo.
echo ========================================
echo SERVIDOR ARRANCANDO EN: http://localhost:3000
echo ========================================
echo Presiona Ctrl+C para detener
echo.

npm run start-server
pause
