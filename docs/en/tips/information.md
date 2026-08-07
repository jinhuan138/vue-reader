# Get Book Metadata

:::demo

```vue
<template>
  <vue-reader
    v-show="false"
    url="/vue-reader/files/啼笑因缘.epub"
    :getRendition="getRendition"
  />
  <div v-if="information" style="color: #000">
    <img
      :src="information.cover"
      :alt="information.title"
      style="width: 100px"
    />
    <p>Title:{{ information.title }}</p>
    <p>Author:{{ information.creator }}</p>
    <p>Publisher:{{ information.publisher }}</p>
    <p>Language:{{ information.language }}</p>
    <p>Publication Date:{{ information.pubdate }}</p>
    <p>Modified Date:{{ information.modified_date }}</p>
    <p>Description:{{ information.description }}</p>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

const information = ref(null)
const getRendition = (rendition) => {
  const book = rendition.book
  book.ready.then(() => {
    book.loaded.metadata.then(async (metadata) => {
      const cover = await book.coverUrl()
      information.value = { ...metadata, cover }
    })
  })
}
</script>
```

:::