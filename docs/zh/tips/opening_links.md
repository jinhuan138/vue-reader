# 在 epub.js iframe 中打开链接或运行脚本

epub.js 会在 iframe 中渲染 EPUB 内容，默认使用 `sandbox="allow-same-origin"`。若要在 EPUB 中打开链接或运行 JavaScript，需要通过 `epubOptions` 属性传入额外参数。

:::demo
```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url='/vue-reader/files/Newton’s Apple.epub'
      :location="1"
      :epubOptions='{
        allowPopups: true, // Adds `allow-popups` to sandbox-attribute
        allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
      }'
    />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

:::
