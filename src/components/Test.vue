<template>
  <div style="height: 100vh">
    <vue-reader
      url="/files/啼笑因缘.epub"
      :getRendition="getRendition"
      :class="theme + '-theme'"
    >
    </vue-reader>
    <div>
      <button @click="theme = 'light'">Light theme</button>
      <button @click="theme = 'dark'">Dark theme</button>
    </div>
  </div>
</template>
<script setup>
import VueReader from '../modules/index'
import { ref, watch } from 'vue'
let rendition = null
const theme = ref('dark')

const updateTheme = (rendition, theme) => {
  const themes = rendition.themes
  switch (theme) {
    case 'dark': {
      themes.override('color', '#fff')
      themes.override('background', '#000')
      break
    }
    case 'light': {
      themes.override('color', '#000')
      themes.override('background', '#fff')
      break
    }
  }
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

<style>
.dark-theme .readerArea {
  background-color: #000;
}

.dark-theme .titleArea {
  color: #ccc;
}

.dark-theme .tocButtonExpanded {
  color: #222;
}

.dark-theme .tocButtonBar {
  background: #fff;
}

.dark-theme .tocButton {
  color: white;
}
.dark-theme .tocArea {
  background-color: #111;
}

.dark-theme .readerArea .arrow {
  color: white;
}

.dark-theme .readerArea .arrow:hover {
  color: #ccc;
}
</style>
