# Change font-size

Hooking into epubJS rendition object is the key for this also.

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
    />
    <div :class="$style.size">
      <button
        :class="$style.button"
        @click="changeSize(Math.max(80, size - 10))"
      >
        -
      </button>
      <span>Current size: {{ size }}%</span>
      <button
        :class="$style.button"
        @click="changeSize(Math.min(130, size + 10))"
      >
        +
      </button>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

let rendition = null
const size = ref(100)
const changeSize = (val) => {
  size.value = val
  rendition.themes.fontSize(`${val}%`)
}
const getRendition = (val) => {
  rendition = val
  rendition.themes.fontSize(`${size.value}%`)
}
</script>
<style module>
.size {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  text-align: center;
  color: #000;
}
.button {
    min-width: 48px; 
    height: 24px; 
    border-radius: 4px; 
    text-align: center; 
    color: #606266;
    margin:0 5px;
    background: #dcdfe6;
} 
</style>
```
:::