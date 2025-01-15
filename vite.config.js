import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	assetsInclude: ['**/*.geojson'],
	server: {
		port: 3000,
		strictPort: false
	},
	preview: {
		port: 4173,
		strictPort: false
	}
});
