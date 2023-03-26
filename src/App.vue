<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" :getRendition="val => rendition = val" :tocChanged="val => toc = val"
        v-model:location="location" @update:location="locationChange">
        <template #title="props">
          <div class="title">
            {{ props.title }}
          </div>
        </template>
        <template #loadingView>
          <div class="loadingView">
            加载中。。。
          </div>
        </template>
      </VueReader>
      <div class="page">
        {{ page }}
      </div>
    </div>
  </div>
  <!-- <Library /> -->
  <!-- <div class="demo" v-drag="dragHandler" :dragOptions="dragOptions">
   </div> -->
</template>
<script setup>
// import { VueReader } from "../lib/index.min.js";
import VueReader from "./modules/VueReader/VueReader.vue";
import Library from '@/components/Library.vue'
import { dragDirective } from '@vueuse/gesture'
import { ref, onMounted } from "vue";
const location = ref(5)
const rendition = ref(null)
const toc = ref(null)
const page = ref('')

onMounted(() => {
  location.value = 0
})
//页码
const locationChange = (epubcifi) => {
  if (rendition.value && toc.value) {
    const { displayed, href } = rendition.value.location.start
    console.log(toc.value, href)
    const chapter = toc.value.find(item => {
      if (item.subitems.length) {
        return item.subitems.find(item => item.href.includes(href))
      } else {
        return item.href.includes(href)
      }
    })
    const label = chapter.subitems.length ? chapter.subitems.find(item => item.href.includes(href)).label : chapter.label || 'n/a'
    page.value = `Page ${displayed.page} of ${displayed.total} in chapter ${label}`
  }
}
//滑动翻页
const vDrag = dragDirective({
  throttle: 1000,
  enabled: false
})
const dragOptions = {

}
const dragHandler = ({ movement: [x, y] }) => {
  if (x > 0) {
    console.log('right swipe')
  } else {
    console.log('left swipe')
  }
}
const getRendition = (rendition) => {

}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
  overflow: hidden;
}

.vueContainer {
  font-size: 16px;
  position: absolute;
  top: 0px;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
}

.demo {
  width: 100px;
  height: 100px;
  background-color: skyblue;
}

.title {
  text-align: center;
  color: skyblue;
}

.loadingView {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  color: skyblue;
  text-align: center;
  margin-top: -.5em;
}

.page {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
