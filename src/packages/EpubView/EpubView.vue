<template>
  <div class="reader">
    <div class="viewHolder">
      <div ref="viewer" id="viewer" v-show="isLoaded"></div>
      <div v-if="!isLoaded">
        <slot v-if="isError" name="errorView"> </slot>
        <slot v-else name="loadingView"> </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//http://epubjs.org/documentation/0.3/
//https://github.com/johnfactotum/foliate-js
import { ref, onMounted, onUnmounted, watch, unref, toRefs } from 'vue'
import Epub from 'epubjs'
import type { Book, Rendition, Contents, Location, NavItem } from 'epubjs'
import type { BookOptions } from 'epubjs/types/book'
import type { RenditionOptions } from 'epubjs/types/rendition'
import {
  clickListener,
  swipListener,
  wheelListener,
  keyListener,
} from '../utils/listener/listener'

export interface EpubViewProps {
  url: string | ArrayBuffer
  location?: number | string | Location['start']
  tocChanged?: (toc: Array<NavItem>) => void
  getRendition?: (rendition: Rendition) => void
  handleTextSelected?: (cfiRange: string, contents: Contents) => void
  handleKeyPress?: () => void
  epubInitOptions?: BookOptions
  epubOptions?: RenditionOptions
}

const props = defineProps<EpubViewProps>()

const {
  epubInitOptions = {},
  epubOptions = {},
  handleKeyPress,
  handleTextSelected,
  getRendition,
  tocChanged,
} = props

const { url, location } = toRefs(props)

const emit = defineEmits<{
  'update:location': [Location['start']]
}>()

const viewer = ref<HTMLDivElement | null>(null)
const toc = ref<Array<NavItem>>([])
const isLoaded = ref(false)
const isError = ref(false)
let book: null | Book = null,
  rendition: null | Rendition = null

// 存储 iframe 事件清理函数，防止内存泄漏
const iframeCleanups: Array<() => void> = []
// 记录已注册监听器的 document，防止同一 document 重复注册
const registeredDocs = new WeakSet<Document>()

const cleanupIframeListeners = () => {
  iframeCleanups.forEach((fn) => fn())
  iframeCleanups.length = 0
}

const initBook = async () => {
  cleanupIframeListeners() // 切换书籍前清理旧的 iframe 事件监听器
  if (book) book.destroy()
  if (url.value) {
    book = Epub(unref(url), epubInitOptions)
    book.on('openFailed', (error: Error) => {
      console.error(error)
      isError.value = true
    })
    book!.loaded.navigation.then(({ toc: _toc }) => {
      isLoaded.value = true
      toc.value = _toc
      tocChanged && tocChanged(_toc)
      initReader()
    })
  }
}

const initReader = () => {
  rendition = book!.renderTo(viewer.value as HTMLDivElement, {
    width: '100%',
    height: '100%',
    ...epubOptions,
  })
  registerEvents()
  getRendition && getRendition(rendition)
  if (typeof location.value === 'string') {
    rendition.display(location.value)
  } else if (typeof location.value === 'number') {
    rendition.display(location.value)
  } else if (toc.value.length > 0 && toc?.value[0]?.href) {
    rendition.display(toc.value[0].href)
  } else {
    rendition.display()
  }
}

const flipPage = (direction: string) => {
  if (direction === 'next') nextPage()
  else if (direction === 'prev') prevPage()
}

const registerEvents = () => {
  if (rendition) {
    rendition.on('rendered', (e: Event, iframe: any) => {
      const doc = iframe?.document as Document | undefined
      if (!doc) return

      iframe?.iframe?.contentWindow.focus()

      // 避免在同一 document 上重复注册监听器（每次翻页都会触发 rendered）
      if (!registeredDocs.has(doc)) {
        registeredDocs.add(doc)
        if (!epubOptions?.flow?.includes('scrolled')) {
          iframeCleanups.push(wheelListener(doc, flipPage))
        }
        iframeCleanups.push(swipListener(doc, flipPage))
        iframeCleanups.push(keyListener(doc, flipPage))
      }
    })
    rendition.on('locationChanged', onLocationChange)
    rendition.on('displayError', () => console.error('error rendering book'))
    if (handleTextSelected) {
      rendition.on('selected', handleTextSelected)
    }
    if (handleKeyPress) {
      rendition.on('keypress', handleKeyPress)
    }
  }
}

const onLocationChange = (loc: Location) => {
  //监听翻页
  const newLocation = loc.start
  if (location.value !== newLocation) {
    emit('update:location', loc.start)
  }
}

watch(url, initBook)

const nextPage = () => {
  rendition?.next()
}

const prevPage = () => {
  rendition?.prev()
}

const setLocation = (href: number | string) => {
  if (typeof href === 'string') rendition!.display(href)
  if (typeof href === 'number') rendition!.display(href)
}

onMounted(() => {
  initBook()
})

onUnmounted(() => {
  cleanupIframeListeners()
  book?.destroy()
})

defineExpose({
  nextPage,
  prevPage,
  setLocation,
})
</script>
<style scoped>
.reader {
  position: absolute;
  inset: 50px 50px 20px;
}

.viewHolder {
  height: 100%;
  width: 100%;
  position: relative;
}

#viewer {
  height: 100%;
}
</style>
