# Save and Restore Reading Progress

Saving the current reading location to local storage is straightforward. Keep in mind that the `update:location` event is also emitted during the initial render.

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      :location="location"
      url="/vue-reader/files/啼笑因缘.epub"
      @update:location="locationChange"
    />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { useStorage } from '@vueuse/core'

const location = useStorage('book-progress', '0')

const locationChange = (epubcifi) => {
  location.value = epubcifi
}
</script>
```

:::
