import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: '/flipping-pages/',
    build: {
        target: 'es2021',
        outDir: 'dist-demo',
    },
});
