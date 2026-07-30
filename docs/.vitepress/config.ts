//https://vitepress.dev/
import { defineConfig } from 'vitepress'
import { demoBlockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'epub component for Vue',
    base: '/vue-reader/',
    cleanUrls: true,
    locales: {
        en: {
            label: 'English',
            lang: 'en-US',
            link: '/en/',
            description: 'epub component for Vue',
            themeConfig: {
                nav: [
                    { text: 'Guide', link: '/en/guide/introduction' },
                    { text: 'Reader', link: '/en/reader' },
                ],
                sidebar: [
                    {
                        text: 'Guide',
                        items: [{ text: 'introduction', link: '/en/guide/introduction' }],
                    },
                    {
                        text: 'Tips',
                        items: [
                            { text: 'page number', link: '/en/tips/page_number' },
                            { text: 'font size', link: '/en/tips/font_size' },
                            { text: 'custom css', link: '/en/tips/custom_css' },
                            { text: 'hightlight', link: '/en/tips/hightlight' },
                            { text: 'missing mime-types', link: '/en/tips/missing_mime_types' },
                            { text: 'smooth scroll', link: '/en/tips/smooth_scroll' },
                            { text: 'scrolled', link: '/en/tips/scrolled' },
                            { text: 'opening links', link: '/en/tips/opening_links' },
                            { text: 'speak', link: '/en/tips/speak' },
                            { text: 'information', link: '/en/tips/information' },
                            { text: 'import file', link: '/en/tips/import_file' },
                            { text: 'current progress', link: '/en/tips/current_progress' },
                            { text: 'lightbox', link: '/en/tips/lightbox' },
                            { text: 'search', link: '/en/tips/search' },
                            { text: 'disable context menu', link: '/en/tips/disable_context_menu' },
                            { text: 'custom font', link: '/en/tips/custom_font' },
                            { text: 'spread', link: '/en/tips/spread' },
                            { text: 'save progress', link: '/en/tips/storage_progress' },
                        ],
                    },
                ],
            },
        },
        zh: {
            label: '简体中文',
            lang: 'zh-CN',
            link: '/zh/',
            description: '适用于 Vue 的 EPUB 阅读器组件',
            themeConfig: {
                nav: [
                    { text: '指南', link: '/zh/guide/introduction' },
                    { text: '阅读器', link: '/zh/reader' },
                ],
                sidebar: [
                    { text: '指南', items: [{ text: '介绍', link: '/zh/guide/introduction' }] },
                    {
                        text: '使用技巧',
                        items: [
                            { text: '显示页码', link: '/zh/tips/page_number' },
                            { text: '调整字号', link: '/zh/tips/font_size' },
                            { text: '自定义样式', link: '/zh/tips/custom_css' },
                            { text: '高亮文本', link: '/zh/tips/hightlight' },
                            { text: '处理缺失的 MIME 类型', link: '/zh/tips/missing_mime_types' },
                            { text: '平滑滚动', link: '/zh/tips/smooth_scroll' },
                            { text: '滚动阅读', link: '/zh/tips/scrolled' },
                            { text: '打开链接与运行脚本', link: '/zh/tips/opening_links' },
                            { text: '朗读文本', link: '/zh/tips/speak' },
                            { text: '获取图书信息', link: '/zh/tips/information' },
                            { text: '导入文件', link: '/zh/tips/import_file' },
                            { text: '当前阅读进度', link: '/zh/tips/current_progress' },
                            { text: '图片预览', link: '/zh/tips/lightbox' },
                            { text: '搜索', link: '/zh/tips/search' },
                            { text: '禁用右键菜单', link: '/zh/tips/disable_context_menu' },
                            { text: '自定义字体', link: '/zh/tips/custom_font' },
                            { text: '页面布局', link: '/zh/tips/spread' },
                            { text: '保存阅读进度', link: '/zh/tips/storage_progress' },
                        ],
                    },
                ],
                outlineTitle: '本页目录',
                docFooter: { prev: '上一页', next: '下一页' },
                lastUpdatedText: '最后更新',
                darkModeSwitchLabel: '外观',
                sidebarMenuLabel: '菜单',
                returnToTopLabel: '返回顶部',
                langMenuLabel: '切换语言',
            },
        },
    },
    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' },
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    head: [
        ['link', { rel: 'alternate icon', href: '/logo.png', type: 'image/png', sizes: '16x16' }],
        ['script', {}, `(function () {
            var base = '/vue-reader/'
            var pathname = window.location.pathname

            if (pathname !== base && pathname !== base.slice(0, -1)) return

            var languages = navigator.languages || [navigator.language || '']
            var prefersChinese = languages.some(function (language) {
                return language.toLowerCase().indexOf('zh') === 0
            })

            window.location.replace(base + (prefersChinese ? 'zh/' : 'en/'))
        })()`],
        ['script', {
            async: 'async',
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9017742413133429',
            crossorigin: 'anonymous',
        }],
    ],
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
            provider: 'algolia',
            options: {
                indexName: 'vue-reader document search',
                appId: 'JF9QLK223Q',
                apiKey: '28ce46c055168c5afcd85319ca19eb97',
            }
        },
        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'introduction', link: '/guide/introduction' },
                ],
            },
            {
                text: 'Tips',
                items:
                    [
                        { text: "page number", link: "tips/page_number" },
                        { text: "font size", link: "tips/font_size" },
                        { text: "custom css", link: "tips/custom_css" },
                        { text: "hightlight", link: "tips/hightlight" },
                        { text: "missing mime-types", link: "tips/missing_mime_types" },
                        { text: "smooth scroll", link: "tips/smooth_scroll" },
                        { text: "scrolled", link: "tips/scrolled" },
                        { text: "opening links", link: "tips/opening_links" },
                        { text: "speak", link: "tips/speak" },
                        { text: "information", link: "tips/information" },
                        { text: "import file", link: "tips/import_file" },
                        { text: "current progress", link: "tips/current_progress" },
                        { text: "lightbox", link: "tips/lightbox" },
                        { text: "search", link: "tips/search" },
                        { text: "disable context menu", link: "tips/disable_context_menu" },
                        { text: "custom font", link: "tips/custom_font" },
                        { text: "spread", link: "tips/spread" },
                    ],
            }
        ]
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
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or 'modern'
                },
            },
        },
    }
})
