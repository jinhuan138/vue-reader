//https://vitepress.dev/
import { defineConfig } from 'vitepress'
import { demoBlockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'epub component for Vue',
    base: '/vue-reader/',
    cleanUrls: true,
    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' },
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    head: [
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
        nav: [{
            text: "Guide", link: "/guide/introduction"
        },
        { text: "Reader", link: "/reader" }],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/jinhuan138/vue-reader' }
        ],
        search: {
            provider: 'local'
        },
        sidebar: {
            "/guide/": {
                base: "/guide/",
                items: [
                    {
                        text: "Guide",
                        items: [
                            {
                                text: "Introduction",
                                link: "introduction",
                            }
                        ],
                    },
                    {
                        text: "Tips",
                        items: [
                            {
                                text: "page number",
                                link: "tips/page_number",
                            },
                            {
                                text: "font size",
                                link: "tips/font_size",
                            },
                            {
                                text: "custom css",
                                link: "tips/custom_css",
                            },
                            {
                                text: "hightlight",
                                link: "tips/hightlight",
                            },
                            {
                                text: "missing mime-types",
                                link: "tips/missing_mime_types",
                            }, {
                                text: "smooth scroll",
                                link: "tips/smooth_scroll",
                            }, {
                                text: "scrolled",
                                link: "tips/scrolled",
                            }, {
                                text: "opening links",
                                link: "tips/opening_links",
                            }, {
                                text: "speak",
                                link: "tips/speak",
                            }, {
                                text: "information",
                                link: "tips/information",
                            }, {
                                text: "import file",
                                link: "tips/import_file",
                            }, 
                            {
                                text: "current progress",
                                link: "tips/current_progress",
                            },
                            {
                                text: "lightbox",
                                link: "tips/lightbox",
                            }, {
                                text: "search",
                                link: "tips/Search",
                            }, {
                                text: "disable context menu",
                                link: "tips/disable_context_menu",
                            }, {
                                text: "custom font",
                                link: "tips/custom_font",
                            },
                        ],
                    },
                ],
            },
        },
    },
    vite: {
        plugins: [demoblockVitePlugin()],
        publicDir: resolve(__dirname, "../../public"),
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
