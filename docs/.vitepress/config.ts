//https://vitepress.dev/

import { defineConfig } from 'vitepress'
import { demoBlockPlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/docs/',
    cleanUrls:true,
    markdown: {
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    themeConfig: {
        nav: [
            // { text: "library", link: "/library" },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/jinhuan138/docs' }
        ],
    },
    vue: {
    },
    vite: {
        publicDir: resolve(__dirname, "../../public"),
        server: {
            port: 3030,
        },
        preview: {
            port: 8080,
        },
        resolve: {
            alias: [
                { find: '@', replacement: resolve(__dirname, '../../src') },
                { find: '/', replacement: resolve(__dirname, '../../') },
                { find: 'comps', replacement: resolve(__dirname, '../../src/components') },
            ]
        }
    }
})
