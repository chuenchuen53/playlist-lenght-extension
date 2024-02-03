import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    target: "es2015",
    outDir: "build",
    assetsDir: "content",
    rollupOptions: {
      input: {
        pub: "/content-script-src/content.ts"
      }
    }
  }
});
