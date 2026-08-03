# Highlight Selected Text in an EPUB

This example uses the epub.js annotations API to highlight selected text and save each highlight in a list, allowing users to return to or remove it.

:::demo 

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :location="1" :getRendition="getRendition"/>
  </div>
  <div :class="$style.selection">
    Highlights:
    <ul>
      <li v-for="({ text, cfiRange }, index) in selections" :key="index">
        {{ text || '' }}
        <button class="button-example" @click="show(cfiRange)">View</button>
        <button class="button-example" @click="remove(cfiRange, index)">
          x
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref, onUnmounted } from 'vue'

let rendition = null
const selections = ref([])

const setRenderSelection = (cfiRange, contents) => {
  selections.value.push({
    text: rendition.getRange(cfiRange).toString(),
    cfiRange,
  })
  rendition.annotations.add('highlight', cfiRange, {}, (e) => {
      console.log('highlight click')
    }, 'hl', {
    fill: 'red',
    'fill-opacity': '0.5',
    'mix-blend-mode': 'multiply',
    cursor: "pointer",
    "pointer-events": "all"
  })
  contents.window.getSelection().removeAllRanges()
}

const getRendition = (val) => {
  rendition = val
  rendition.themes.default({
    '::selection': {
      background: 'orange',
    },
  })
  rendition.on('selected', setRenderSelection)
}

const remove = (cfiRange, index) => {
  rendition.annotations.remove(cfiRange, 'highlight')
  selections.value = selections.value.filter((item, j) => j !== index)
}

const show = (cfiRange) => {
  rendition.display(cfiRange)
}

onUnmounted(() => {
  rendition.off('selected', setRenderSelection)
})
</script>

<style module>
.selection {
  z-index: 1;
  background-color: white;
  color: #000;
}
</style>
```

:::