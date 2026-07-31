<div align="center">
  <img width=250 src="https://raw.githubusercontent.com/jinhuan138/vue-reader/master/public/logo.png" />
  <h1>VueReader</h1>
</div>

[简体中文](./README.zh-CN.md)

<p>
  <a href="https://www.npmjs.com/package/vue-reader" target="_blank">
    <img src="https://img.shields.io/npm/v/vue-reader?style=flat-square"/>
  </a>
  <a href="https://www.npmjs.com/package/vue-reader" target="_blank">
    <img src="https://img.shields.io/npm/dm/vue-reader?style=flat-square"/>
  </a>
  <a href="https://www.npmjs.com/package/vue-reader" target="_blank">
    <img src="https://packagephobia.com/badge?p=vue-reader" />
  </a>
  <a href="https://www.npmjs.com/package/vue-reader" target="_blank">
    <img src="https://img.shields.io/github/stars/jinhuan138/vue-reader?color=white&label" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/vue-reader?style=flat-square"/>
  </a>
</p>

<div align="center">
  <h2><a href="https://jinhuan138.github.io/vue-reader/en/">📖 Documentation</a></h2>
</div>

# Introduction

An easy way to embed an EPUB reader in your web app.

## Installation

> From v1.3.x, vue-reader no longer supports Vue 2. Please use v1.2.x for Vue 2 support.

```bash
npm i vue-reader
pnpm add vue-reader
```

## Basic Usage

<details>
<summary>Vue 3</summary>

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

</details>

<details>
<summary>Vue 2</summary>

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub"> </vue-reader>
  </div>
</template>
<script>
import { VueReader } from 'vue-reader'
export default {
  components: { VueReader },
}
</script>
```

</details>

## VueReader API

### VueReader Props

| **Name**                                    | **Description**                      | **Type**               | **Default** |
| ------------------------------------------- | ------------------------------------ | ---------------------- | ----------- |
| url                                         | URL or `ArrayBuffer` of the book              | `string`/`ArrayBuffer` | —           |
| title                                       | Title of the book                | `string`               | —           |
| showToc                                     | Whether to show the table of contents              | `boolean`              | `true`      |
| [EpubView Props](#epubview-props) | All EpubView props are supported. | -                      |

### VueReader Slots

| **Name**                          | **Description**                 |
| --------------------------------- | ------------------------------- |
| title                             | Title of the book           |
| [EpubView slots](#epubview-slots) | All EpubView slots are supported. |

### VueReader Exposed Methods

| **Name**                              | **Description**                   |
| ------------------------------------- | --------------------------------- |
| [EpubView exposed methods](#epubview-exposed-methods) | All methods exposed by EpubView are available. |

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

## Related

- [react-reader](https://github.com/gerhardsletten/react-reader)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jinhuan138/vue-reader&type=Date)](https://star-history.com/#jinhuan138/vue-reader&Date)

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>
