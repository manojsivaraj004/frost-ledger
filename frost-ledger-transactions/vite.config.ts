import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      __CF_PAGES_COMMIT_SHA__: JSON.stringify(env.CF_PAGES_COMMIT_SHA || 'local-dev'),
      __CF_PAGES_BRANCH__: JSON.stringify(env.CF_PAGES_BRANCH || 'local'),
      __CF_PAGES_URL__: JSON.stringify(env.CF_PAGES_URL || 'http://localhost:5173'),
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
      __APP_VERSION__: JSON.stringify('1.0.0'),
    },
  }
})
