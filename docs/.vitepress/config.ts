//https://vitepress.dev/
//https://1006008051.github.io/vitepress-demoblock/demo/guide/quickstart.html

import { defineConfig } from 'vitepress'
import demoblock from 'vitepress-demoblock';

export default defineConfig({
    outDir: '../public',
    title: 'vue-reader',
    description: 'vue-reader document',
    base: '/docs/',
    // srcDir: '../../',
    markdown: {
        config: (md) => {
            md.use(demoblock)
        }
    },
    themeConfig: {
    }
})
