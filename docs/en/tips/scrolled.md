# Use a Scrolled EPUB Layout

Set the epub.js flow mode through the rendition object.

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