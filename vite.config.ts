import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    const base = '/';

    return {
      base,
      envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/auth': {
            target: 'http://127.0.0.1:54321',
            changeOrigin: true,
            secure: false,
          },
          '/rest': {
            target: 'http://127.0.0.1:54321',
            changeOrigin: true,
            secure: false,
          },
          '/storage': {
            target: 'http://127.0.0.1:54321',
            changeOrigin: true,
            secure: false,
          },
          '/realtime': {
            target: 'http://127.0.0.1:54321',
            changeOrigin: true,
            secure: false,
            ws: true,
          },
          '/functions': {
            target: 'http://127.0.0.1:54321',
            changeOrigin: true,
            secure: false,
          },
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
