import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(), eslint()],
  clearScreen: false,
});
