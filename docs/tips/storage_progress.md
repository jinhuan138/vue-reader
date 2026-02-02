# Save and retrieve progress from storage

Saving the current page on storage is pretty simple, but we need to keep in mind that `locationChanged` also gets called on the very first render of our app.

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

const location = useStorage('book-progress', 0, undefined, {
  serializer: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v),
  },
})

const locationChange = (epubcifi) => {
  location.value = epubcifi
}
</script>
```

:::