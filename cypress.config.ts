import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
	projectId: 'yp82ef',
	video: false,
	defaultCommandTimeout: 10000,
	viewportWidth: 1366,
	viewportHeight: 768,
	e2e: {
		setupNodeEvents(on) {
			on('file:preprocessor', vitePreprocessor());
		},
		baseUrl: 'http://localhost:3000',
		specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
	},
	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
});
