import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Điều này giúp cấu hình đúng đường dẫn cho môi trường sản xuất
      },
    },
  },
  server: {
    historyApiFallback: true, // Chuyển hướng tất cả các request về index.html
  },
});
