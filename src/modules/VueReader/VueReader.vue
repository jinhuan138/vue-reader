<template>
  <div class="container">
    <div class="readerArea" :class="{ containerExpanded: expandedToc }">
      <!-- 翻页 -->
      <button class="tocButton" :class="{ tocButtonExpanded: expandedToc }" type="button"
        @click="expandedToc = !expandedToc">
        <span class="tocButtonBar" style="top: 35%"></span>
        <span class="tocButtonBar" style="top: 66%"></span>
      </button>
      <!-- 书名 -->
      <div class="titleArea" v-if="title">{{ title }}</div>
      <!-- 阅读 -->
      <epub-view ref="epubRef" :url="$attrs.url" :tocChanged="onTocChange" />
    </div>
    <!-- 目录 -->
    <div>
      <div class="tocArea">
        <div>
          <button type="button" v-for="(item, index) in toc" :key="index" class="tocAreaButton"
            @click="setLocation(item.href)">
            {{ item.label }}
          </button>
        </div>
      </div>
      <!-- <div class="tocBackground"></div> -->
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, toRefs } from "vue";
import EpubView from "../EpubView/EpubView.vue";
const epubRef = ref(null);
const props = defineProps({
  title: {
    type: String,
  },
})
const book = reactive({
  toc: [],//目录
  expandedToc: false//目录展开
})
const { toc, expandedToc } = toRefs(book)

const onTocChange = (_toc) => {
  toc.value = _toc
}
const setLocation = (href) => {
  epubRef.value.setLocation(href);
  expandedToc.value = false;
};

</script>
<style scoped>
/* container */
.container {
  overflow: hidden;
  height: 100%;
}

.containerExpanded {
  transform: translateX(256px);
}

.readerArea {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s ease;
}

.titleArea {
  position: absolute;
  top: 20px;
  left: 50px;
  right: 50px;
  text-align: center;
  color: #999;
}

/* toc */
.tocBackground {
  position: absolute;
  left: 256px;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.tocArea {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  width: 256px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #f2f2f2;
  padding: 10px 0;
}

.tocArea .tocAreaButton {
  user-select: none;
  appearance: none;
  background: none;
  border: none;
  display: block;
  font-family: sans-serif;
  width: 100%;
  font-size: 0.9em;
  text-align: left;
  padding: 0.9em 1em;
  border-bottom: 1px solid #ddd;
  color: #aaa;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
}

.tocButton {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

/* tocButton */
.tocButtonBar {
  position: absolute;
  width: 60%;
  background: #ccc;
  height: 2px;
  left: 50%;
  margin: -1px -30%;
  top: 50%;
  transition: all 0.5s ease;
}

.tocButtonExpanded {
  background: #f2f2f2;
}
</style>