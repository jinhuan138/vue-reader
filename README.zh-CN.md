<div align="center">
  <img width=250 src="https://raw.githubusercontent.com/jinhuan138/vue-reader/master/public/logo.png" />
  <h1>VueReader</h1>
</div>

[English](./README.md)

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
  <h2><a href="https://jinhuan138.github.io/vue-reader/zh/">📖 中文文档</a></h2>
</div>

# 介绍

轻松地将 EPUB 阅读器嵌入你的 Web 应用。

## 安装

> 从 v1.3.x 开始，vue-reader 不再支持 Vue 2。如需在 Vue 2 中使用，请安装 v1.2.x。

```bash
npm i vue-reader
pnpm add vue-reader
```

## 基本用法

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
    <vue-reader url="/files/啼笑因缘.epub" />
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

### VueReader 属性

| **名称** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| url | 图书 URL 或 ArrayBuffer | `string`/`ArrayBuffer` | — |
| title | 图书标题 | `string` | — |
| showToc | 是否显示目录 | `boolean` | true |
| [EpubView 属性](#epubview-属性) | 可使用全部 EpubView 属性。 | - | |

### VueReader 插槽

| **名称** | **说明** |
| --- | --- |
| title | 图书标题 |
| [EpubView 插槽](#epubview-插槽) | 可使用全部 EpubView 插槽。 |

### VueReader 暴露的方法

| **名称** | **说明** |
| --- | --- |
| [EpubView 暴露的方法](#epubview-暴露的方法) | 可使用 EpubView 暴露的全部方法。 |

## EpubView API

### EpubView 属性

| **名称** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| url | 图书路径或 ArrayBuffer | `string`/`ArrayBuffer` | — |
| location | 设置或更新 EPUB 阅读位置 | `string`/`number` | — |
| tocChanged | 阅读器解析图书后，通过此回调接收章节数组 | `function(toc)` | — |
| epubInitOptions | 传递给 EPUB 初始化函数的自定义属性，参见 [epub.js](http://epubjs.org/documentation/0.3/#epub) | `object` | — |
| epubOptions | 传递给 EPUB 渲染器的自定义属性，参见 [epub.js 的 book.renderTo 函数](http://epubjs.org/documentation/0.3/#rendition) | `object` | — |
| getRendition | epub.js 渲染 EPUB 文件后，通过此回调获取 rendition 对象 | `function(rendition)` | — |

### EpubView 事件

| **名称** | **说明** | **类型** |
| --- | --- | --- |
| update:location | 接收当前阅读位置。页面变化以及首次渲染时都会触发。 | `function(location)` |
| select | 选中文本时触发 | `function(cfirange,contents)` |
| keyPress | 按下按键时触发 | `function(keyboardEvent)` |

## EpubView 插槽

| **名称** | **说明** |
| --- | --- |
| loadingView | EPUB 加载时显示的内容 |
| errorView | EPUB 加载失败时显示的内容 |

## EpubView 暴露的方法

| **名称** | **说明** | **类型** |
| --- | --- | --- |
| nextPage | 显示下一页 | `function` |
| prevPage | 显示上一页 | `function` |
| setLocation | 跳转到指定位置 | `function(href)` |

## 相关项目

- [react-reader](https://github.com/gerhardsletten/react-reader)

## Star 历史

<a href="https://www.star-history.com/?repos=jinhuan138%2Fvue-reader&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=jinhuan138/vue-reader&type=date&theme=dark&legend=top-left&sealed_token=oPZqZ3j2b3otLfasNB629tk7A5APd2Aq2KwsK88HFR5Ijp_2u8U0CiEDFHyJU1AxBVKY4s2uX5Hw3678wCUJ0-Z3Wu0aZ5hJP2YVcJC0JnMbLzlD-qzf-wkQC6rn-rwApBxjpsTRaUffxbsfkLbkWkxzwDLYY86mHblFouAWoijgXJauYWUTswkmwO4O" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=jinhuan138/vue-reader&type=date&legend=top-left&sealed_token=oPZqZ3j2b3otLfasNB629tk7A5APd2Aq2KwsK88HFR5Ijp_2u8U0CiEDFHyJU1AxBVKY4s2uX5Hw3678wCUJ0-Z3Wu0aZ5hJP2YVcJC0JnMbLzlD-qzf-wkQC6rn-rwApBxjpsTRaUffxbsfkLbkWkxzwDLYY86mHblFouAWoijgXJauYWUTswkmwO4O" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=jinhuan138/vue-reader&type=date&legend=top-left&sealed_token=oPZqZ3j2b3otLfasNB629tk7A5APd2Aq2KwsK88HFR5Ijp_2u8U0CiEDFHyJU1AxBVKY4s2uX5Hw3678wCUJ0-Z3Wu0aZ5hJP2YVcJC0JnMbLzlD-qzf-wkQC6rn-rwApBxjpsTRaUffxbsfkLbkWkxzwDLYY86mHblFouAWoijgXJauYWUTswkmwO4O" />
 </picture>
</a>
<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>