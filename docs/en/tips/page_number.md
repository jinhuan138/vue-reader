# Display page number for current chapter

We store the epubjs rendition in a ref, and get the page numbers in the callback when location is changed. Note that in this example we also find them name of the current chapter from the toc. Also see limitation for pagination for the whole book.

:::demo
```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
      :tocChanged="tocChanged"
      @update:location="locationChange"
    />
  </div>
  <div :class="$style.page">{{ page }}</div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

let rendition = null,
  toc = []
const page = ref('')

const getRendition = (val) => (rendition = val)
const tocChanged = (val) => (toc = val)

const getLabel = (toc, href) => {
  let label = 'n/a'
  toc.some((item) => {
    if (item.subitems.length > 0) {
      const subChapter = getLabel(item.subitems, href)
      if (subChapter !== 'n/a') {
        label = subChapter
        return true
      }
    } else if (item.href.includes(href)) {
      label = item.label
      return true
    }
  })
  return label
}
const locationChange = (epubcifi) => {
  if (epubcifi) {
    const { displayed, href } = rendition.location.start
    const { cfi } = rendition.location.end
      const label = getLabel(toc, href)
      page.value = `${displayed.page}/${displayed.total} ${label}`
  }
}
</script>
<style module>
.page {
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
```

:::