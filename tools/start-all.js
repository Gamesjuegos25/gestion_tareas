#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backendPort = process.env.BACKEND_PORT || process.env.PORT || '3001';
const frontendPort = process.env.FRONTEND_PORT || '5173';

function start(command, args, envVars, name) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: Object.assign({}, process.env, envVars),
  });

  proc.on('close', (code) => {
    console.log(`${name} exited with code ${code}`);
    process.exit(code);
  });
}

console.log(`Starting backend on port ${backendPort} and frontend on port ${frontendPort}`);

start('npm', ['--prefix', 'backend', 'run', 'start:dev'], { PORT: backendPort }, 'backend');
start('npm', ['--prefix', 'frontend', 'run', 'dev'], { PORT: frontendPort }, 'frontend');
