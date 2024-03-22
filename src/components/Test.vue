<template>
  <div style="height: 100vh">
    <vue-reader
      url="/books/红楼梦.epub"
      :getRendition="getRendition"
    >
      <template v-slot:loadingView>加载中。。。{{progress}}%</template>
    </vue-reader>
    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="visibleRef = false"
    ></vue-easy-lightbox>
  </div>
</template>
<script setup>
import VueReader from '../modules/index'
import VueEasyLightbox from 'vue-easy-lightbox'
import { ref, onUnmounted } from 'vue'

const imgsRef = ref([])
const indexRef = ref(0)
const visibleRef = ref(false)

const getRendition = (rendition) => {
  rendition.hooks.content.register(({ document }, view) => {
    imgsRef.value = []
    const imgs = [
      ...document.querySelectorAll('img'),
      ...document.querySelectorAll('image'),
    ]
    imgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        visibleRef.value = true
        indexRef.value = index
      })
      imgsRef.value.push(img.src)
    })
  })
}
//请求
const progress =ref(0)
const originalOpen = XMLHttpRequest.prototype.open
const onProgress = (e) => {
  progress.value = (e.loaded / e.total*100).toFixed(2)
}
XMLHttpRequest.prototype.open = function () {
  this.addEventListener('progress', onProgress)
  originalOpen.apply(this, arguments)
}
onUnmounted(() => {
  XMLHttpRequest.prototype.open = originalOpen
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
