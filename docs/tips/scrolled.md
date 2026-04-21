# Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
     :getRendition="getRendition"
    >
    </vue-reader>
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