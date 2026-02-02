# Disable context menu

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
    const body = contents.window.document.querySelector('body')
    if (body) {
      body.oncontextmenu = () => {
        return false
      }
    }
  })
}
</script>
```

:::