---
outline: [2,3]
---

# Introduction

an easy way to embed a ePub into your webapp

## Installation

::: code-group
```sh [npm]
npm i vue-reader
```

```sh [pnpm]
pnpm add vue-reader
```
:::

## Basic Usage

And in your vue-component...

::: details Vue 3
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-reader/files/啼笑因缘.epub'/>
   </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

:::

::: details Vue 2
```vue
<template>
  <div style='height: 100vh'>
    <vue-reader url='/vue-reader/files/啼笑因缘.epub'/>
  </div>
</template>
<script>
import { VueReader } from 'vue-reader'

export default {
  components: { VueReader }
}
</script>
```

:::

## Different Builds

|       **Module**        |       **Filename**        |
| :---------------------: | :-----------------------: |
|    UMD(for browsers)    | vue-reader.global-full.js |
|        CommonJS         |     vue-reader.cjs.js     |
| ES Module(for bundlers) |     vue-reader.es.js      |

## VueReader Attributes

| **Name**         | **Description**           | **Type**               | **Default** |
| -----------------| --------------------------| ---------------------- | ----------- |
| url              | book url or arrayBuffer   | `string`/`ArrayBuffer` | —           |
| title            | the title of the book     | `string`               | —           |
| showToc          | whether to show the toc   | `boolean`              | true        |
| backgroundColor  | backgroundColor of reader | `string`               | #fff        |

## VueReader Events
| **Name** | **Description**           | **Type**               |
| -------- | -----------------------   | ---------------------- |
| progress | book url request progress | function(percentage)   |

## VueReader Slots

| **Name** | **Description**                                                                     |
| -------- | ----------------------------------------------------------------------------------- |
| title    | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |

## VueReader props passed to inner EpubView

## EpubView Attributes

| **Name**        | **Description**                                                                                                                      | **Type**               | **Default** |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ----------- |
| url             | the path or arrayBuffer of the book                                                                                                  | `string`/`ArrayBuffer` | —           |
| location        | set / update location of the epub                                                                                                    | `string`/`number`      | —           |
| tocChanged      | when the reader has parsed the book you will receive an array of the chapters                                                        | `function(toc)`        | —           |
| epubInitOptions | pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub)                           | `object`               | —           |
| epubOptions     | pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#rendition) | `object`               | —           |
| getRendition    | when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here                                        | `function(rendition)`  | —           |

## EpubView Events

| **Name**        | **Description**                                                                                                                                          | **Type**                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| update:location | a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders. | `function(location)`          |
| select          | when select text                                                                                                                                         | `function(cfirange,contents)` |
| keyPress        | when press the key                                                                                                                                       | `function(keyboardEvent)`     |

## EpubView  Slots

| **Name**    | **Description**       |
| ----------- | --------------------- |
| loadingView | epub view loadingView |

## EpubView Exposes

| **Name**    | **Description**        | **Type**         |
| ----------- | ---------------------- | ---------------- |
| nextPage    | display  next page     | `function`       |
| prevPage    | display  previous page | `function`       |
| setLocation | Set the page           | `function(href)` |