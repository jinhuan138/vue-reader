# 当前阅读进度

使用 Element Plus 滑块控制阅读进度，并在悬浮提示中显示当前位置对应的章节名称。

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
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
let rendition, book, displayed
let flattenedToc = []

const loadToc = async () => {
  const items = []

  const walk = async (toc = []) => {
    for (const item of toc) {
      const href = item.href.replace(/^\.\.\//, '').replace(/^\//, '')
      const [spineHref, id] = href.split('#')
      const spineItem = book.spine.get(spineHref)

      if (spineItem) {
        await spineItem.load(book.load.bind(book))
        const element = id
          ? spineItem.document.getElementById(id)
          : spineItem.document.body

        if (element) {
          const cfi = spineItem.cfiFromElement(element)
          const percentage = book.locations.percentageFromCfi(cfi)
          if (Number.isFinite(percentage)) {
            items.push({ label: item.label.trim(), percentage })
          }
        }

        spineItem.unload()
      }

      await walk(item.subitems)
    }
  }

  await walk(book.navigation.toc)
  flattenedToc = items.sort((a, b) => a.percentage - b.percentage)
}

const labelFromPercentage = (percent) => {
  if (!flattenedToc.length) return ''

  const target = Math.max(0, Math.min(100, Number(percent) || 0)) / 100
  let currentToc = flattenedToc[0]

  for (const item of flattenedToc) {
    if (item.percentage > target) break
    currentToc = item
  }

  return currentToc.label
}

const getRendition = (val) => {
  rendition = val
  book = rendition.book
  displayed = rendition.display()
  book.ready
    .then(() => book.locations.generate(1600))
    .then(async () => {
      await loadToc()
      // 图书渲染完成后获取当前阅读百分比
      displayed.then(() => {
        const currentLocation = rendition.currentLocation()
        const currentPage = book.locations.percentageFromCfi(
          currentLocation.start.cfi
        )
        current.value = Math.round(currentPage * 10000) / 100
      })
      rendition.on('relocated', (location) => {
        const percent = book.locations.percentageFromCfi(location.start.cfi)
        current.value = Math.round(percent * 10000) / 100
      })
    })
}

const change = (value) => {
  current.value = value
  const cfi = book.locations.cfiFromPercentage(value / 100)
  rendition.display(cfi)
}
</script>
<style module>
.progress {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 2;
}
</style>
```

:::
