# Preview Images

:::demo

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/vue-reader/files/玫瑰圣经.epub"
      :getRendition="getRendition"
      location="epubcfi(/6/16!/4/2/1:0)"
    />
    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="visibleRef = false"
    ></vue-easy-lightbox>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import VueEasyLightbox from 'vue-easy-lightbox'
import { ref } from 'vue'

const imgsRef = ref([])
const indexRef = ref(0)
const visibleRef = ref(false)

const getRendition = (rendition) => {
  rendition.themes.default({
    img: {
      cursor: 'pointer'
    },
    image: {
      cursor: 'pointer'
    }
  });
  rendition.hooks.content.register(({ document }, view) => {
    imgsRef.value = []
    const imgs = [
      ...document.querySelectorAll('img'),
      ...document.querySelectorAll('image'),
    ]
    imgs.forEach((img, index) => {
      img.title = 'View image'
      img.addEventListener('click', () => {
        visibleRef.value = true
        indexRef.value = index
      })
      imgsRef.value.push(img.src || img.getAttribute('xlink:href'))
    })
  })
}
</script>
```

:::