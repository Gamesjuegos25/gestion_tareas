# install_and_run.ps1
# Ejecutar: cd ruta && .\install_and_run.ps1

Write-Host "========================================" -ForegroundColor Green
Write-Host "Instalador y Ejecutor - Task Filter App" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1) Comprobar Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)){
    Write-Host "Node.js no encontrado. Instalando..." -ForegroundColor Yellow
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)){
        Write-Host "ERROR: winget no disponible. Descarga Node.js manualmente desde https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
    winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
    Start-Sleep -Seconds 2
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)){
        Write-Host "ERROR: Node aún no disponible. Reinicia PowerShell e intenta de nuevo." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ Node $(node -v) encontrado" -ForegroundColor Green
Write-Host "✓ npm $(npm -v) encontrado" -ForegroundColor Green

# 2) Instalar dependencias
Write-Host "`nInstalando dependencias npm..." -ForegroundColor Cyan
npm install 2>&1 | Out-String | Write-Host

if ($LASTEXITCODE -ne 0){
    Write-Host "ERROR: npm install falló" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencias instaladas" -ForegroundColor Green

# 3) Compilar TypeScript
Write-Host "`nCompilando TypeScript..." -ForegroundColor Cyan
npm run build 2>&1 | Out-String | Write-Host

if ($LASTEXITCODE -ne 0){
    Write-Host "ERROR: npm run build falló" -ForegroundColor Red
    exit 1
}

Write-Host "✓ TypeScript compilado a ./dist" -ForegroundColor Green

# 4) Arrancar servidor
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "SERVIDOR ARRANCANDO EN: http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

npm run start-server
