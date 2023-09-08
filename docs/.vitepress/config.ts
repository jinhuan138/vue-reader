//https://vitepress.dev/
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitepress'
import { demoBlockPlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/vue-reader',
    cleanUrls: true,
    markdown: {
        // theme: { light: 'github-light', dark: 'github-dark' },
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
            { icon: 'github', link: 'https://github.com/jinhuan138/vue-reader' }
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
            port: 3333,
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
