# 平滑滚动

将 epub.js manager 容器的 CSS 属性 `scroll-behavior` 设置为 `smooth`。

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition">
    </vue-reader>
  </div>
</template>
<script setup>
import VueReader from 'vue-reader'

const getRendition = (rendition) => {
  rendition.hooks.content.register((contents) => {
    rendition.manager.container.style['scroll-behavior'] = 'smooth'
  })
}
</script>
```

:::
