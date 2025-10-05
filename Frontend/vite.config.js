import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
  }
})
