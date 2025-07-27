import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // dev server settings (for local development)
  server: {
    host: true,                // listen on 0.0.0.0
    strictPort: true,          // exit if port is already in use
    port: Number(process.env.PORT) || 5173,
    // allow requests from the Render domain in dev
    allowedHosts: [
      'apply-online-course-frontendd.onrender.com'
    ]
  },

  // preview server settings (for vite preview in production)
  preview: {
    host: true,                // listen on 0.0.0.0
    strictPort: true,
    port: Number(process.env.PORT) || 4173,
    // allow the Render domain
    allowedHosts: [
      'apply-online-course-frontendd.onrender.com'
    ]
  }
})
