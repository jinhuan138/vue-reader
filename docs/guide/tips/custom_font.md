# Custom font

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader url="/vue-reader/files/alice.epub" :getRendition="getRendition"/>
    <div class="theme">
      <button class="button-example" @click="updateTheme">Toggle theme ({{ theme }})</button>
    </div>
  </div>
</template>
<script setup>
import VueReader from 'vue-reader'
import { ref } from 'vue'
    
const theme = ref('custom')
let rendition = null

const updateTheme = () => {
  const themes = rendition.themes

  switch (theme.value) {
    case 'default': {
      themes.override('font-family', 'pinia')
      theme.value = 'custom'
      break
    }
    case 'custom': {
      themes.override('font-family', 'Arial')
      theme.value = 'default'
      break
    }
  }
}

const getRendition = (val) => {
  rendition = val
  rendition.hooks.content.register((contents) => {
    const document = contents.window.document
    console.log('document', document)
    if (document) {
      const css = `
              @font-face {
                font-family: "pinia";
                font-weight: 400;
                font-style: normal;
                src: url("/vue-reader/files/pinia.ttf") format('truetype');
              }
              `
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
    }
  })
}
</script>
```

:::
