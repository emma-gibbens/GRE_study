import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This must match your repo name, since GitHub Pages serves project sites
// from https://<user>.github.io/<repo>/, not from the domain root.
export default defineConfig({
  plugins: [react()],
  base: "/GRE_study/",
});
