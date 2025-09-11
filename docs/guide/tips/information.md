# Get book information

:::demo

```vue
<template>
  <vue-reader
    v-show="false"
    url="/vue-reader/files/啼笑因缘.epub"
    :getRendition="getRendition"
  >
  </vue-reader>
  <div v-if="information" style="color: #000">
    <img
      :src="information.cover"
      :alt="information.title"
      style="width: 100px"
    />
    <p>标题:{{ information.title }}</p>
    <p>作者:{{ information.creator }}</p>
    <p>出版社:{{ information.publisher }}</p>
    <p>语言:{{ information.language }}</p>
    <p>出版日期:{{ information.pubdate }}</p>
    <p>修改日期:{{ information.modified_date }}</p>
    <p>介绍:{{ information.description }}</p>
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