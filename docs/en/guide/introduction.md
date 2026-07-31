---
outline: [2,3]
---

# Introduction

An easy way to embed an EPUB reader in your web app.
## Installation

> From v1.3.x, vue-reader no longer supports Vue 2. Please use v1.2.x for Vue 2 support.


::: code-group
```sh [npm]
npm i vue-reader
```

```sh [pnpm]
pnpm add vue-reader
```
:::

## Basic Usage

Use it in your Vue component:

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

|       **Module**        |       **Filename**    |
| :---------------------: | :-------------------: |
|    UMD(for browsers)    | vue-reader.umd.js     |
|        CommonJS         | vue-reader.cjs.js     |
| ES Module(for bundlers) | vue-reader.es.js      |

## VueReader API

### VueReader Props

| **Name** | **Description**                   | **Type**                              | **Default** |
| -------- | --------------------------------- | ------------------------------------- | ----------- |
| url      | URL or `ArrayBuffer` of the book           | `string`/`ArrayBuffer`                | —           |
| title    | Title of the book             | `string`                              | —           |
| showToc  | Whether to show the table of contents           | `boolean`                             | `true`      |
| [EpubView props](#epubview-props) |  All EpubView props are supported. | -           |

### VueReader Slots

| **Name**                          | **Description**                  |
| --------------------------------- | -------------------------------- |
| title                             | Title of the book            |
| [EpubView slots](#epubview-slots) |  All EpubView slots are supported. |

### VueReader Exposed Methods
| **Name**                              | **Description**                     |
| ------------------------------------- | ----------------------------------- | 
| [EpubView exposed methods](#epubview-exposed-methods) |  All methods exposed by EpubView are available.  |

## EpubView API

### EpubView Props

| **Name**        | **Description**                                                                                                                      | **Type**               | **Default** |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ----------- |
| url             | Path or `ArrayBuffer` of the book                                                                                                  | `string`/`ArrayBuffer` | —           |
| location        | Sets or updates the reading location                                                                                                    | `string`/`number`      | —           |
| tocChanged      | Called with the table of contents after the book has been parsed                                                        | `function(toc)`        | —           |
| epubInitOptions | Custom options passed to the EPUB initialization function; see [epub.js](http://epubjs.org/documentation/0.3/#epub)                           | `object`               | —           |
| epubOptions     | Custom options passed to the EPUB rendition; see [epub.js's `book.renderTo` function](http://epubjs.org/documentation/0.3/#rendition) | `object`               | —           |
| getRendition    | Called with the epub.js rendition instance after the book has been rendered                                        | `function(rendition)`  | —           |

### EpubView Events

| **Name**        | **Description**                                                                                                                                          | **Type**                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| update:location | Emitted with the current reading location whenever the page changes and after the initial render. | `function(location)`          |
| select          | Emitted when text is selected.                                                                                                                                         | `function(cfirange, contents)` |
| keyPress        | Emitted when a key is pressed.                                                                                                                                       | `function(keyboardEvent)`     |

## EpubView Slots

| **Name**    | **Description**       |
| ----------- | --------------------- |
| loadingView | Content displayed while the EPUB is loading |
| errorView   | Content displayed when the EPUB fails to load   |

## EpubView Exposed Methods

| **Name**    | **Description**       | **Type**         |
| ----------- | --------------------- | ---------------- |
| nextPage    | Displays the next page     | `function`       |
| prevPage    | Displays the previous page | `function`       |
| setLocation | Navigates to the specified location          | `function(href)` |

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>