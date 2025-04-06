import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		plugins: [react()],
		build: {
			outDir: "./demo",
			emptyOutDir: true, // Helps to keep each build fresh, no lingering artifacts from older builds
		},
	};
});
