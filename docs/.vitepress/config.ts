//https://vitepress.dev/
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitepress'
import { demoBlockPlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/docs/',
    cleanUrls: true,
    markdown: {
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    locales: {
        root: {
            label: 'English',
            lang: 'en'
        },
        zh: {
            label: '中文',
            lang: 'zh'
        }
    },
    plugins: [
        visualizer()
    ],
    themeConfig: {
        nav: [
            { text: "Reader", link: "/reader" },
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
