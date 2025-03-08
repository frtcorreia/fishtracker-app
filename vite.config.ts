import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {},
    middlewareMode: true,
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: "dist",
  },
});
