import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ Remplace "djerba-prospector" par le NOM EXACT de ton dépôt GitHub
export default defineConfig({
  plugins: [react()],
  base: '/djerba-prospector/',   // <-- nom du repo GitHub
})
