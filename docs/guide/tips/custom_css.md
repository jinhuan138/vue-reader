# Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

:::demo

```vue
<template>
  <div :style="{
    height: '100vh',
    position: 'relative',
    '--book-color': theme.color,
    '--book-background': theme.background,
  }">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition"/>
    <div class="theme-demo">
      <div :style="item" v-for="item in themeChips" @click="theme = item">A</div>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref, watch, computed } from 'vue'

let rendition = null
const themeChips = [
  { color: '#000', background: '#fff' },
  { color: '#fff', background: '#000' },
  { color: '#36503e', background: '#f5deb3' },
  { color: '#594429', background: '#c5e7cf' },
  { color: '#e8e8e8', background: '#111b21' },
]
const theme = ref(themeChips[0])

const updateTheme = (rendition, theme) => {
  const themes = rendition.themes
  themes.override('color', theme.color)
  themes.override('background', theme.background)
}

const getRendition = (_rendition) => {
  rendition = _rendition
  updateTheme(_rendition, theme.value)
}

watch(theme, (currentTheme) => {
  if (rendition) {
    updateTheme(rendition, currentTheme)
  }
})
</script>
<style scoped>
.theme-demo {
  position: absolute;
  bottom: 10px;
  list-style: none;
  display: flex;
  gap: 10px;
  left: 50%;
  margin-left: -70px;
  z-index: 999;
}
.theme-demo div {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}

:deep(.readerArea) {
  background: var(--book-background) !important;
}

:deep(.readerArea .titleArea) {
  color: var(--book-color) !important;
}

:deep(.tocArea) {
  color: var(--book-color) !important;
  background: var(--book-background) !important;
}

:deep(.tocAreaButton) {
  color: var(--book-color) !important;
}
</style>

```

:::