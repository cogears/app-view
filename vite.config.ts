import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            { find: '@', replacement: resolve(__dirname, 'src') },
            { find: 'types', replacement: resolve(__dirname, 'types') },
        ]
    },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'app-view',
            // the proper extensions will be added
            fileName: 'app-view',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'vue-router', '@cogears/http-client'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    '@cogears/http-client': 'HttpClient',
                },
            },
        },
    },
})
