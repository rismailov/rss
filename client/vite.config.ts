import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@api/schemas': path.resolve(
                __dirname,
                './../api/src/api/api.schemas.ts',
            ),
        },
    },
})
