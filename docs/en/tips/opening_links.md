# Open Links or Run Scripts Inside the epub.js iframe

epub.js renders EPUB content inside an iframe that uses `sandbox="allow-same-origin"` by default. To open links or run JavaScript inside an EPUB, pass the required options through the `epubOptions` prop.

:::demo
```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url='/vue-reader/files/Newton’s Apple.epub'
      :location="1"
      :enableSwipe="false"
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
