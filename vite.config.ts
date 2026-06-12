import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
    base: '/skydeck/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src/components', import.meta.url))
        }
    },
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        tailwindcss(),
    ],
    build: {
        outDir: 'docs'
    },
    
})
