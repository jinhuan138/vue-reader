//https://vitepress.dev/
import { defineConfig } from 'vitepress'
import { demoBlockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

export default defineConfig({
    title: 'vue-reader',
    description: 'EPUB reader component for Vue',
    base: '/vue-reader/',
    cleanUrls: true,
    locales: {
        en: {
            label: 'English',
            lang: 'en-US',
            link: '/en/',
            description: 'EPUB reader component for Vue',
            themeConfig: {
                nav: [
                    { text: 'Guide', link: '/en/guide/introduction' },
                    { text: 'Reader', link: '/reader/home' },
                ],
                sidebar: [
                    {
                        text: 'Guide',
                        items: [{ text: 'Introduction', link: '/en/guide/introduction' }],
                    },
                    {
                        text: 'Tips',
                        items: [
                            { text: 'Page number', link: '/en/tips/page_number' },
                            { text: 'Font size', link: '/en/tips/font_size' },
                            { text: 'Custom CSS', link: '/en/tips/custom_css' },
                            { text: 'Highlight', link: '/en/tips/highlight' },
                            { text: 'MIME types', link: '/en/tips/missing_mime_types' },
                            { text: 'Smooth scrolling', link: '/en/tips/smooth_scroll' },
                            { text: 'Scrolled layout', link: '/en/tips/scrolled' },
                            { text: 'Links and scripts', link: '/en/tips/opening_links' },
                            { text: 'Read text aloud', link: '/en/tips/speak' },
                            { text: 'Book metadata', link: '/en/tips/information' },
                            { text: 'Import an EPUB', link: '/en/tips/import_file' },
                            { text: 'Reading progress', link: '/en/tips/current_progress' },
                            { text: 'Image preview', link: '/en/tips/lightbox' },
                            { text: 'Search', link: '/en/tips/search' },
                            { text: 'Disable context menu', link: '/en/tips/disable_context_menu' },
                            { text: 'Custom font', link: '/en/tips/custom_font' },
                            { text: 'Page spread', link: '/en/tips/spread' },
                            { text: 'Save reading progress', link: '/en/tips/storage_progress' },
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
                    { text: '阅读器', link: '/reader/home' },
                ],
                sidebar: [
                    { text: '指南', items: [{ text: '介绍', link: '/zh/guide/introduction' }] },
                    {
                        text: '使用技巧',
                        items: [
                            { text: '显示页码', link: '/zh/tips/page_number' },
                            { text: '调整字号', link: '/zh/tips/font_size' },
                            { text: '自定义样式', link: '/zh/tips/custom_css' },
                            { text: '高亮文本', link: '/zh/tips/highlight' },
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
        { text: "Reader", link: "/reader/home" }],
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
                    { text: 'Introduction', link: '/guide/introduction' },
                ],
            },
            {
                text: 'Tips',
                items:
                    [
                        { text: "Page number", link: "tips/page_number" },
                        { text: "Font size", link: "tips/font_size" },
                        { text: "Custom CSS", link: "tips/custom_css" },
                        { text: "Highlight", link: "tips/highlight" },
                        { text: "MIME types", link: "tips/missing_mime_types" },
                        { text: "Smooth scrolling", link: "tips/smooth_scroll" },
                        { text: "Scrolled layout", link: "tips/scrolled" },
                        { text: "Links and scripts", link: "tips/opening_links" },
                        { text: "Read text aloud", link: "tips/speak" },
                        { text: "Book metadata", link: "tips/information" },
                        { text: "Import an EPUB", link: "tips/import_file" },
                        { text: "Reading progress", link: "tips/current_progress" },
                        { text: "Image preview", link: "tips/lightbox" },
                        { text: "Search", link: "tips/search" },
                        { text: "Disable context menu", link: "tips/disable_context_menu" },
                        { text: "Custom font", link: "tips/custom_font" },
                        { text: "Page spread", link: "tips/spread" },
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
