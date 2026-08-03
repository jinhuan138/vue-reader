# Enable Smooth Scrolling

Set the CSS `scroll-behavior` property of the epub.js manager container to `smooth`.

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition"/>
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
