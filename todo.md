# 二级目录hover
# 页码显示
# 页码左侧显示
# 图片放大
# 引用
# 滚动条
# 参考

## Document
[document](https://jinhuan138.github.io/docs/)

import Vibrant from 'node-vibrant/dist/vibrant'
const palette = await Vibrant.from(cover).getPalette()
bgColorFromCover: palette.DarkVibrant.hex,//主题色

## zoom the image

```bash
npm install medium-zoom --save
```

```vue
<template>
    <div style='height: 100vh'>
        <VueReader 
            :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "/node_modules/medium-zoom/dist/medium-zoom.min.js"}' 
            url='/files/啼笑因缘.epub' :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>
import { nextTick } from 'vue'
let rendition = null
const getRendition = val => rendition = val

nextTick(async () => {
    rendition.hooks.content.register((contents, view) => {
        const { document } = contents
        const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        contents.window.mediumZoom(images)
    })
})
</script>
```
