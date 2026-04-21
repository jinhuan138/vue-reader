# spread

:::demo

```vue
<template>
  <div style="height:100vh">
    <VueReader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
  </div>
</template>
<script setup>
import VueReader from 'vue-reader'
const getRendition = (rendition) => {
  rendition.spread('none')
  // rendition.spread('spread')
}
</script>
```

:::