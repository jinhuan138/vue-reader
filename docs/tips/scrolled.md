# Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :epubOptions="{
        flow: 'scrolled',
        manager: 'continuous',
      }"
    >
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

:::