<template>
  <div class="container">
    <div class="readerArea" :class="{ containerExpanded: expandedToc }">
      <!--展开目录 -->
      <button v-if="showToc" class="tocButton" :class="{ tocButtonExpanded: expandedToc }" type="button"
        @click="toggleToc">
        <span class="tocButtonBar" style="top: 35%"></span>
        <span class="tocButtonBar" style="top: 66%"></span>
      </button>
      <!-- 书名 -->
      <slot name="title" :title='bookName'>
        <div class="titleArea">{{ bookName }}</div>
      </slot>
      <!-- 阅读 -->
      <epub-view ref="epubRef" v-bind="$attrs" :url="url" :tocChanged="onTocChange">
        <template #loadingView>
          <slot name="loadingView">
            <div class="loadingView">
              Loading…
            </div>
          </slot>
        </template>
      </epub-view>
      <!-- 翻页 -->
      <button class="arrow pre" @click="pre">
        ‹
      </button>
      <button class="arrow next" @click="next">
        ›
      </button>
    </div>
    <!-- 目录 -->
    <div v-if="showToc">
      <div class="tocArea">
        <div>
          <button type="button" v-for="(item, index) in toc" :key="index" class="tocAreaButton"
            @click="setLocation(item.href)">
            {{ item.label }}
          </button>
        </div>
      </div>
      <!-- 目录遮罩 -->
      <div v-if="expandedToc" class="tocBackground" @click="toggleToc"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue";
import EpubView from "../EpubView/EpubView.vue";
const epubRef = ref<InstanceType<typeof EpubView> | null>(null)

const props = defineProps<{
  title: {
    type: String,
  },
  url: {
    type: String,
    required: true
  },
  showToc: {
    type: Boolean,
    default: true
  },
  swipeAble: {
    type: Boolean,
    default: false
  },
  tocChanged: {
    type: Function,
  }
}>()
const { title, tocChanged } = props

const book = reactive({
  toc: [],//目录
  expandedToc: false,//目录展开
})
const { toc, expandedToc } = toRefs(book)

const bookName = computed(() => {
  if (title) {
    return title
  } else {
    let reg = /\/files\/(.*?)\.epub/;
    return props.url.match(reg)[1];
  }

})

const toggleToc = () => {
  expandedToc.value = !expandedToc.value
}


const onTocChange = (_toc) => {
  toc.value = _toc
  tocChanged && tocChanged(_toc)
}


const setLocation = (href:string|number) => {
  epubRef?.value?.setLocation(href);
  expandedToc.value = false;
};

const next = () => {
  epubRef?.value?.nextPage()
}

const pre = () => {
  epubRef?.value?.prevPage()
}

</script>
<style scoped>
/* container */
.container {
  overflow: hidden;
  position: relative;
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

/* 翻页 */
.arrow {
  outline: none;
  border: none;
  background: none;
  position: absolute;
  top: 50%;
  margin-top: -32px;
  font-size: 64px;
  padding: 0 10px;
  color: #E2E2E2;
  font-family: arial, sans-serif;
  cursor: pointer;
  user-select: none;
  appearance: none;
  font-weight: normal
}

.arrow:hover {
  color: #777
}

.prev {
  left: 1px;
}

.next {
  right: 1px
}

/* loading */
.loadingView {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  color: #ccc;
  text-align: center;
  margin-top: -.5em;
}
</style>