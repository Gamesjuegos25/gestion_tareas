#!/bin/bash
# start.sh - Starter script for macOS/Linux

echo "========================================"
echo "Instalador - Task Filter App"
echo "========================================"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado."
    echo "Instala Node.js desde https://nodejs.org/ o usando tu gestor de paquetes."
    exit 1
fi

echo "✓ Node $(node -v) encontrado"
echo "✓ npm $(npm -v) encontrado"

echo ""
echo "Instalando dependencias npm..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: npm install falló"
    exit 1
fi

echo ""
echo "Compilando TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: npm run build falló"
    exit 1
fi

echo ""
echo "========================================"
echo "SERVIDOR ARRANCANDO EN: http://localhost:3000"
echo "========================================"
echo "Presiona Ctrl+C para detener"
echo ""

npm run start-server
