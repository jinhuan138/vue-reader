//https://vitepress.dev/
import { defineConfig } from 'vitepress'
import { demoBlockPlugin,demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/vue-reader',
    cleanUrls: true,
    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' },
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    head:[
        ['link', { rel: 'alternate icon', href: '/logo.png', type: 'image/png', sizes: '16x16' }],
        ['script', {
            async: 'async',
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9017742413133429',
            crossorigin: 'anonymous',
        }],
    ],
    // locales: {
    //     root: {
    //         label: 'English',
    //         lang: 'en'
    //     },
    //     zh: {
    //         label: '中文',
    //         lang: 'zh'
    //     }
    // },
    themeConfig: {
        logo: '/logo.svg',
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
        plugins: [demoblockVitePlugin()],
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
        },
        ssr: {
            noExternal: ['vue-reader']
        },
    }
})
