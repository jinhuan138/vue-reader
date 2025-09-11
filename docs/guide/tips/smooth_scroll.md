# Smooth Scroll

Sets css-property for epub-js manager to scroll-behavior: smooth

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
