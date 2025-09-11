# Import file

:::demo

```vue
<template>
  <div
    style="height: 100vh; position: relative"
    :style="{ height: url ? '100vh' : '50px' }"
  >
    <vue-reader v-if="url" :url="url" />
    <input class="input" type="file" accept=".epub" @change="onchange" />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

const url = ref(null)
const onchange = (e) => {
  const file = e.target.files[0]
  if (window.FileReader) {
    var reader = new FileReader()
    reader.onloadend = (e) => (url.value = reader.result)
    reader.readAsArrayBuffer(file)
  }
}
</script>
<style>
.input {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
}
</style>
```

:::