# 处理服务器缺失或错误的 MIME 类型

epub.js 会尝试解析传入的 EPUB 文件。如果服务器返回了错误的 MIME 类型，或文件名不包含 `.epub` 后缀，可以通过 `epubInitOptions` 属性指定文件格式，确保内容被正确读取。

下面的示例使用了一个不带 `.epub` 后缀的 EPUB 文件：

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/啼笑因缘"
      :epubInitOptions="{ openAs: 'epub' }"
    />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

:::
