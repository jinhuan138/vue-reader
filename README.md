# Vue Reader - an easy way to embed a ePub into your webapp
An vue-reader for vue powered by EpubJS

[See demo](https://jinhuan138.github.io/reader/)

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...

```vue

<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub"></VueReader>
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

### Attributes

| **Name** | **Description**                   | **Type**          | **Default** |
| -------- | --------------------------------- | ----------------- | ----------- |
| url      | book url                          | `string`          | —           |
| title    | the title of the book             | `string`          | —           |
| showToc  | whether to show the toc           | `boolean`         | true        |
| location | set / update location of the epub | `string`/`number` | —           |

### Events

| **Name**        | **Description**                                              | **Parameters**       |
| --------------- | ------------------------------------------------------------ | -------------------- |
| update:location | a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders. | the updated location |

### Slots

| **Name**    | **Description**                                              |
| ----------- | ------------------------------------------------------------ |
| title       | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |
| loadingView | epub view loadingView                                        |

