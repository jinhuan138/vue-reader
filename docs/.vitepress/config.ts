//https://vitepress.dev/
//https://1006008051.github.io/vitepress-demoblock/demo/guide/quickstart.html

import { defineConfig } from 'vitepress'
import demoblock from 'vitepress-demoblock';
import { demoBlockPlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/docs/',
    markdown: {
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    cleanUrls: true,
    themeConfig: {
    },
    rewrites: {
    },
    vue: {

    },
    vite: {
        publicDir: "../../public",
        server: {
            port: 3030,
        },
        preview: {
            port: 8080,
        },
        resolve: {
            alias: [
                { find: '@', replacement: resolve(__dirname, '../../src') },
                { find: 'comps', replacement: resolve(__dirname, '../../src/components') }
            ]
        }
    }
})
