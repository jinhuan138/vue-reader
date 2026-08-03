# 使用滚动模式显示 EPUB

可以通过 rendition 对象设置 epub.js 的内容流模式。

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
     :getRendition="getRendition"
    />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
const getRendition = (rendition) => {
  rendition.flow('scrolled-doc')
  //rendition.flow('paginated')
}
</script>
```

:::