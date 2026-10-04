import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function serveCesiumStaticDev(): Plugin {
  return {
    name: 'serve-cesium-static-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/cesiumStatic/')) {
          const relativePath = req.url.replace('/cesiumStatic/', '');
          const filePath = path.resolve(
            import.meta.dirname,
            'node_modules/cesium/Build/Cesium',
            relativePath.split('?')[0]
          );

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
            else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
            else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
            else if (filePath.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm');

            return fs.createReadStream(filePath).pipe(res);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), serveCesiumStaticDev()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '127.0.0.1', 
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      port: 3000
    }
  },
  optimizeDeps: {
    exclude: ['electron', 'cesium']
  },
  build: {
    rollupOptions: {
      external: ['electron', 'cesium']
    }
  }
});