# 当前阅读进度

使用 Element Plus 滑块控制阅读进度，并在悬浮提示中显示当前位置对应的章节名称。

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
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
  // 生成 locations 后才能计算百分比
  book.ready
    .then(() => book.locations.generate(1600))
    .then(() => locationChange(rendition.currentLocation()?.start))
}

// 翻页时同步滑块位置
const locationChange = (location) => {
  if (!location?.cfi || !book?.locations.length()) return
  const percent = book.locations.percentageFromCfi(location.cfi)
  current.value = Math.round(percent * 10000) / 100
}

// 拖动结束后跳转到对应位置
const change = (value) => {
  rendition.display(book.locations.cfiFromPercentage(value / 100))
}

// 从目录中查找 href 对应的章节名
const getLabel = (items, href) => {
  for (const item of items) {
    if (item.href.includes(href)) return item.label.trim()
    const label = getLabel(item.subitems || [], href)
    if (label) return label
  }
  return ''
}

// 悬浮提示显示所在章节
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
