import { defineUserConfig } from 'vuepress'
const blockDemo = require("vuepress-plugin-demo-block-vue3");
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import path from "path"

export default defineUserConfig({
    lang: 'zh-CN',
    base: "/reader/",
    port: 3025,
    open: true,
    title: 'vue-reader',
    description: 'an easy way to embed a ePub into your webapp',
    plugins: [[
        blockDemo({
            path: path.resolve(__dirname,'./examples') ,
        })
    ]],
})