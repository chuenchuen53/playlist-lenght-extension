import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2015"
  },
  plugins: [sveltekit()]
});
