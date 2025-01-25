import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = process.env.VITE_PORT || 3001;
console.log(`Running on port ${port}`);

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './environment',
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 3001, 
  },
});
