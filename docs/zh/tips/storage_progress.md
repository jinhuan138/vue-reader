# 保存并恢复阅读进度

将当前阅读位置保存到本地存储很简单，但需要注意：应用首次渲染时也会触发 `update:location` 事件。

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
