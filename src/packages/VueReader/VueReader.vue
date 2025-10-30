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
      <slot name="title">
        <div class="titleArea" :title="title || bookName">
          {{ title || bookName }}
        </div>
      </slot>
      <!-- 阅读 -->
      <epub-view ref="epubRef" v-bind="$attrs" :url="url" :tocChanged="onTocChange" :getRendition="onGetRendition">
        <template #loadingView>
          <slot name="loadingView">
            <div class="loadingView">Loading…</div>
          </slot>
        </template>
        <template #errorView>
          <slot name="errorView">
            <div class="errorView">Error loading book</div>
          </slot>
        </template>
      </epub-view>
      <!-- 翻页 -->
      <button class="arrow pre" @click="pre" :disabled="currentLocation?.atStart">
        ‹
      </button>
      <button class="arrow next" @click="next" :disabled="currentLocation?.atEnd">
        ›
      </button>
    </div>
    <!-- 目录 -->
    <div v-if="showToc">
      <div class="tocArea">
        <Toc :toc="toc" :current="currentLocation" :setLocation="setLocation" />
      </div>
      <!-- 目录遮罩 -->
      <div v-if="expandedToc" class="tocBackground" @click="toggleToc"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, unref, onUnmounted } from 'vue'
import { Rendition, NavItem, Location } from 'epubjs'
import EpubView from '../EpubView/EpubView.vue'
import Toc from './Toc.vue'

export interface VueReaderProps {
  url: string | ArrayBuffer
  title?: string
  showToc?: boolean
  tocChanged?: (toc: Array<NavItem>) => void
  getRendition?: (rendition: Rendition) => void
}

const props = withDefaults(defineProps<VueReaderProps>(), {
  showToc: true,
})

const emit = defineEmits<{
  progress: [p: number]
}>()

const { tocChanged, getRendition } = props

const { url, title, showToc } = toRefs(props)

const epubRef = ref<InstanceType<typeof EpubView>>()
const currentLocation = ref<Location | null>(null)

const toc = ref<Array<NavItem>>([])
const expandedToc = ref<boolean>(false)

const bookName = ref('')

const toggleToc = () => {
  expandedToc.value = !expandedToc.value
}

const onTocChange = (val: Array<NavItem>) => {
  toc.value = val
  tocChanged && tocChanged(val)
}

const onGetRendition = (rendition) => {
  getRendition && getRendition(rendition)
  rendition.on('relocated', (location) => {
    currentLocation.value = location
  })
  const book = rendition.book
  book.ready.then(() => {
    const meta = book.package.metadata
    bookName.value = meta.title
  })
}

const setLocation = (href: string | number, close: boolean = true) => {
  epubRef?.value?.setLocation(href)
  expandedToc.value = !close
}

//Request
const originalOpen = XMLHttpRequest.prototype.open
const onProgress = (e: ProgressEvent) => {
  emit('progress', Math.floor((e.loaded / e.total) * 100))
}
XMLHttpRequest.prototype.open = function (
  method: string,
  requestUrl: string | URL
) {
  if (typeof unref(url) === 'string' && requestUrl === unref(url)) {
    this.addEventListener('progress', onProgress)
  }
  originalOpen.apply(this, arguments as any)
}

onUnmounted(() => {
  XMLHttpRequest.prototype.open = originalOpen
})

const next = (): void => {
  epubRef.value?.nextPage()
}
const pre = (): void => {
  epubRef.value?.prevPage()
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

.container .titleArea {
  position: absolute;
  top: 20px;
  left: 50px;
  right: 50px;
  text-align: center;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* toc */
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

/* 滚动条 */
.tocArea::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.tocArea::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.tocBackground {
  position: absolute;
  left: 256px;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

/* tocButton */
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
  color: #e2e2e2;
  font-family: arial, sans-serif;
  cursor: pointer;
  user-select: none;
  appearance: none;
  font-weight: normal;
}

.arrow:hover {
  color: #777;
}

.arrow:disabled {
  cursor: not-allowed;
  color: #e2e2e2;
}

.prev {
  left: 1px;
}

.next {
  right: 1px;
}

/* loading */
.loadingView {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  color: #ccc;
  text-align: center;
  margin-top: -0.5em;
}

/* errorView */
.errorView {
  position: 'absolute';
  top: '50%';
  left: '10%';
  right: '10%';
  color: '#c00';
  text-align: 'center';
  margin-top: '-.5em';
}
</style>
