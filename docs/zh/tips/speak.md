# 朗读文本

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
    <div class="theme">
      <button class="button-example" @click="speak">
        {{ isReading ? '停止' : '朗读' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useSpeechSynthesis } from '@vueuse/core'
import { split } from 'sentence-splitter'
import { VueReader } from 'vue-reader'

const isReading = ref(false)
const speechText = ref('')
const { speak: play, stop, status } = useSpeechSynthesis(speechText, { lang: 'zh-CN' })
let rendition
let sentences = []
let text = ''
let nextSection

const getRendition = (value) => {
  rendition = value
  rendition.on('rendered', (_, contents) => {
    text = (contents.document.body?.innerText || '').replace(/\s+/g, ' ').trim()
    nextSection = contents.section.next()
    if (isReading.value) readPage()
  })
}

const next = () => {
  if (nextSection) rendition.display(nextSection.href)
  else isReading.value = false
}

const speak = () => {
  isReading.value = !isReading.value
  if (!isReading.value) {
    stop()
    return
  }

  readPage()
}

const readPage = () => {
  if (!text) return next()
  sentences = split(text, {
    SeparatorParser: { separatorCharacters: ['.', '?', '!', '。', '？', '！'] },
  })
    .filter(({ type }) => type === 'Sentence')
    .map(({ range }) => text.slice(...range))
  voice()
}

const voice = () => {
  if (!isReading.value || !sentences.length) {
    return isReading.value && next()
  }

  speechText.value = sentences.shift()
  play()
}

watch(status, (value) => value === 'end' && isReading.value && voice())
</script>
```

:::