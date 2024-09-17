import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const port = 5173;

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
  '.mjs',
];

// https://vitejs.dev/config/
export default defineConfig({
  root: './web',
  publicDir: './public',
  plugins: [
    react(),
    {
      name: 'custom-logger',
      configureServer(server) {
        server.httpServer?.on('listening', () => {
          // console.clear(); // Optional: Clear any existing logs

          const LanIp = getLanIpAddress();

          console.log('============================================');
          console.log('\tCustom Vite Server Logs');
          console.log('============================================');
          console.log('\tServer is now running...');
          console.log('\tWelcome to your Vite app.');
          console.log(`\t\tLocal:    \x1b[36mhttp://localhost:${port}/\x1b[0m`); // This will ensure the URL is clickable
          console.log(`\t\tNetwork:  \x1b[36mhttp://${LanIp}:${port}/\x1b[0m`); // Clickable URL on network
          console.log('============================================');
        });
      },
    },
  ],
  resolve: {
    extensions: extensions,
    alias: {
      'react-native': 'react-native-web',
    },
  },
  server: {
    host: true,
    port,
  },
  build: {
    outDir: './dist',
  },
});

// Get IPv4
import os from 'os';

// Function to get the LAN IP address (non-internal IPv4 address)
function getLanIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (interfaces[name]) {
      for (const iface of interfaces[name]!) {
        // Only look for IPv4 addresses and ignore internal (localhost) addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return 'localhost'; // Fallback if no external IP is found
}
