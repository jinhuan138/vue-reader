# Vue Reader - an easy way to embed a ePub into your webapp
An vue-reader for vue powered by EpubJS

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...

```vue

<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" title="啼笑因缘"></VueReader>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
  overflow: hidden;
}
.vueContainer {
  font-size: 16px;
  position: absolute;
  top: 0px;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
}
</style>
```

