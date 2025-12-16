# Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/vue-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
      :class="{ darkReaderTheme: theme === 'dark' }"
    />
    <div class="theme">
      <button class="button-example" @click="theme = 'light'">
        Light theme
      </button>
      <button class="button-example" @click="theme = 'dark'">Dark theme</button>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
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
<style lang="scss" scoped>
:deep(.darkReaderTheme) {
  .readerArea {
    background: #000;
    .titleArea {
      color: #ccc;
    }
    .arrow {
      color: white;
    }
  }
  .tocArea {
    color: #ccc;
    background: #111;
  }
  .tocButtonExpanded {
    background: #222;
  }
  .tocButtonBar {
    background: #fff;
  }
  .tocButton {
    color: white;
  }
}
</style>
```

:::