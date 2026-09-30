import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // จำเป็นสำหรับ GitHub Codespaces (ให้เข้าผ่าน port forwarding ได้)
    port: 5173,
    strictPort: true,
  },
});
