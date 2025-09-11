# Handling missing mime-types on server

EpubJS will try to parse the epub-file you pass to it, but if the server send wrong mine-types or the file does not contain `.epub` you can use the epubInitOptions prop to force reading it right.

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