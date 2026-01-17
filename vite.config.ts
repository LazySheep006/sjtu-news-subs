import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: If you are deploying to https://<USERNAME>.github.io/<REPO>/
  // Change the line below to: base: '/<REPO>/',
  // Example: if your repo is called 'sjtu-news', set base: '/sjtu-news/'
  base: './', 
})