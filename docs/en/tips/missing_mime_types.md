# Handle Missing or Incorrect MIME Types

epub.js attempts to parse the EPUB file you provide. If the server returns an incorrect MIME type or the filename does not include the `.epub` extension, use the `epubInitOptions` prop to specify the file format explicitly.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/my-epub-service" :epubInitOptions="{ openAs: 'epub' }">
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```