import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// Load env from workspace root (two levels up from frontend folder)
const rootEnv = loadEnv('', path.resolve(__dirname, '../..'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(rootEnv.VITE_BACKEND_URL || 'http://localhost:3000'),
  },
})
