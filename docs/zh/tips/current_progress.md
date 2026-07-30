# 当前阅读进度

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
      @progress="e => percentage = e"
    >
      <template v-slot:loadingView
        ><el-progress type="circle" :percentage="percentage"
      /></template>
    </vue-reader>
    <div :class="$style.progress">
      <input
        type="number"
        :value="current"
        :min="0"
        :max="100"
        @change="change"
      />%
      <input
        type="range"
        :value="current"
        :min="0"
        :max="100"
        :step="1"
        @change="change"
      />
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ElProgress } from 'element-plus'
import { ref } from 'vue'

const current = ref(0)
// 加载进度
const percentage = ref(0)
let rendition, book, displayed

const getRendition = (val) => {
  rendition = val
  book = rendition.book
  displayed = rendition.display()
  book.ready
    .then(() => {
      return book.locations.generate(1600)
    })
    .then((locations) => {
      // 等待图书渲染完成后获取当前页
      displayed.then(function () {
        // 获取当前 CFI
        var currentLocation = rendition.currentLocation()
        // 根据 CFI 获取百分比（或位置）
        const currentPage = book.locations.percentageFromCfi(
          currentLocation.start.cfi
        )
        current.value = currentPage
      })
      rendition.on('relocated', (location) => {
        const percent = book.locations.percentageFromCfi(location.start.cfi)
        const percentage = Math.floor(percent * 100)
        current.value = percentage
      })
    })
}

const change = (e) => {
  const value = e.target.value
  current.value = value
  var cfi = book.locations.cfiFromPercentage(value / 100)
  rendition.display(cfi)
}
</script>
<style module>
.progress {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.progress > input[type='number'] {
  text-align: center;
}

.progress > input[type='range'] {
  width: 100%;
}
</style>
```

:::