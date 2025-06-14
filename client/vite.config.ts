import {defineConfig, loadEnv} from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "../shared"),
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                },
            },
        },
    };
});
