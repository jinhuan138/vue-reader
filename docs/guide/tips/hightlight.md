# Hightlight selection in epub

This shows how to hook into epubJS annotations object and let the user highlight selection and store this in a list where user can go to a selection or delete it.

:::demo 

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition">
    </vue-reader>
  </div>
  <div class="selection">
    Selection:
    <ul>
      <li v-for="({ text, cfiRange }, index) in selections" :key="index">
        {{ text || '' }}
        <button class="button-example" @click="show(cfiRange)">show</button>
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
  rendition.annotations.add('highlight', cfiRange, {}, null, 'hl', {
    fill: 'red',
    'fill-opacity': '0.5',
    'mix-blend-mode': 'multiply',
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

<style scoped>
.selection {
  z-index: 1;
  background-color: white;
  color: #000;
}
</style>
```

:::