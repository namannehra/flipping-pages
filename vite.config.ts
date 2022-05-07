import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import manifest from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        target: 'es2021',
        lib: {
            name: manifest.name,
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [
                ...Object.keys(manifest.peerDependencies),
                ...Object.keys(manifest.dependencies),
            ],
        },
    },
});
