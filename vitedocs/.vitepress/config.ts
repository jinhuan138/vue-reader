//https://vitepress.dev/
//https://1006008051.github.io/vitepress-demoblock/demo/guide/quickstart.html

import { defineConfig } from 'vitepress'
import { searchPlugin } from "@vuepress/plugin-search";
import demoblock from 'vitepress-demoblock';
import { demoBlockPlugin } from 'vitepress-theme-demoblock'

export default defineConfig({
    outDir: '../public',
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/docs/',
    markdown: {
        config: (md) => {
            md.use(demoBlockPlugin)
        }
    },
    themeConfig: {
    }
})
