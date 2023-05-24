import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import react  from "@vitejs/plugin-react"


export default defineConfig({
    plugins: [tsConfigPaths(), react()],
    test: {
        globals: true,
        setupFiles: ['./tests/setup-tests.ts'],
        environment: "happy-dom"
    }
})