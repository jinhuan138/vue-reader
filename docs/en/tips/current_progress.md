# Reading Progress

Use an Element Plus slider to control reading progress and show the chapter at the hovered position in the tooltip.

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/alice.epub"
      :getRendition="getRendition"
      :tocChanged="tocChanged"
      @update:location="locationChange"
    />
    <div :class="$style.progress">
      <el-slider
        v-model="current"
        :step="0.01"
        :format-tooltip="labelFromPercentage"
        @change="change"
      />
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ElSlider } from 'element-plus'
import { ref } from 'vue'

const current = ref(0)
let rendition, book
let toc = []

const tocChanged = (val) => (toc = val)

const getRendition = (val) => {
  rendition = val
  book = val.book
  // Percentages are only available once locations are generated
  book.ready
    .then(() => book.locations.generate(1600))
    .then(() => locationChange(rendition.currentLocation()?.start))
}

// Keep the slider in sync while reading
const locationChange = (location) => {
  if (!location?.cfi || !book?.locations.length()) return
  const percent = book.locations.percentageFromCfi(location.cfi)
  current.value = Math.round(percent * 10000) / 100
}

// Jump to the position after dragging
const change = (value) => {
  rendition.display(book.locations.cfiFromPercentage(value / 100))
}

// Look up the chapter title of the given href in the table of contents
const getLabel = (items, href) => {
  for (const item of items) {
    if (item.href.includes(href)) return item.label.trim()
    const label = getLabel(item.subitems || [], href)
    if (label) return label
  }
  return ''
}

// Show the chapter of the hovered position in the tooltip
const labelFromPercentage = (percent) => {
  const href = book?.locations.length()
    ? book.spine.get(book.locations.cfiFromPercentage(percent / 100))?.href
    : ''
  return (href && getLabel(toc, href)) || `${percent}%`
}
</script>
<style module>
.progress {
  position: absolute;
  inset: auto 1rem 1rem;
  z-index: 2;
}
</style>
```

:::
