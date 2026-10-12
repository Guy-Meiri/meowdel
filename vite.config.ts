import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { devApi } from './server/dev-api';

export default defineConfig({
  plugins: [react(), devApi()],
});
