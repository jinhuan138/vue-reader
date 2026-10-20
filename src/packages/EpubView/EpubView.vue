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
import { ref, onMounted, onUnmounted, watch, unref, toRefs, nextTick } from 'vue'
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
  enableSwipe?: boolean
  enableKey?: boolean
  enableWheel?: boolean
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
  enableSwipe = true,
  enableKey = true,
  enableWheel = true,
} = props

const { url, location } = toRefs(props)

const emit = defineEmits<{
  'update:location': [string]
}>()

const viewer = ref<HTMLDivElement | null>(null)
const toc = ref<Array<NavItem>>([])
const isLoaded = ref(false)
const isError = ref(false)
let book: null | Book = null,
  rendition: null | Rendition = null
// 切书或卸载时递增，使旧的加载任务失效。
let loadRequest = 0

// 存储 iframe 事件清理函数，防止内存泄漏
const iframeCleanups: Array<() => void> = []
// 记录已注册监听器的 document，防止同一 document 重复注册
const registeredDocs = new WeakSet<Document>()

const cleanupIframeListeners = () => {
  iframeCleanups.forEach((fn) => fn())
  iframeCleanups.length = 0
}

const onLoadError = (error: unknown) => {
  console.error(error)
  isLoaded.value = false
  isError.value = true
}

const getLocation = (value: EpubViewProps['location']) =>
  typeof value === 'object' ? value?.cfi : value

const initBook = async () => {
  const request = ++loadRequest
  isLoaded.value = false
  isError.value = false
  toc.value = []
  cleanupIframeListeners() // 切换书籍前清理旧的 iframe 事件监听器
  book?.destroy()
  book = null
  rendition = null
  if (!url.value) return

  try {
    const currentBook = Epub(unref(url), epubInitOptions)
    book = currentBook
    book.on('openFailed', (error: Error) => {
      if (request === loadRequest) onLoadError(error)
    })
    const { toc: _toc } = await currentBook.loaded.navigation
    if (request !== loadRequest || isError.value) return

    isLoaded.value = true
    toc.value = _toc
    tocChanged && tocChanged(_toc)
    // 等待 v-show 恢复容器尺寸后再初始化阅读器。
    await nextTick()
    if (request !== loadRequest || isError.value) return
    await initReader()
  } catch (error) {
    if (request === loadRequest) onLoadError(error)
  }
}

const initReader = () => {
  rendition = book!.renderTo(viewer.value as HTMLDivElement, {
    width: '100%',
    height: '100%',
    ...epubOptions,
  })
  const currentRendition = rendition
  registerEvents()
  getRendition && getRendition(currentRendition)
  if (currentRendition !== rendition) return
  const target = getLocation(location.value)
  if (typeof target === 'string' && target) {
    return currentRendition.display(target)
  } else if (typeof target === 'number') {
    return currentRendition.display(target)
  } else {
    return currentRendition.display()
  }
}

const flipPage = (direction: string) => {
  if (direction === 'next') nextPage()
  else if (direction === 'prev') prevPage()
}

const registerEvents = () => {
  if (rendition) {
    const request = loadRequest
    rendition.on('rendered', (e: Event, iframe: any) => {
      const doc = iframe?.document as Document | undefined
      if (!doc) return

      iframe?.iframe?.contentWindow.focus()

      // 避免在同一 document 上重复注册监听器（每次翻页都会触发 rendered）
      if (!registeredDocs.has(doc)) {
        registeredDocs.add(doc)
        if (!epubOptions?.flow?.includes('scrolled') && enableWheel) {
          iframeCleanups.push(wheelListener(doc, flipPage))
        }
        if (enableSwipe) {
          iframeCleanups.push(swipListener(doc, flipPage))
        }
        if (enableKey) {
          iframeCleanups.push(keyListener(doc, flipPage))
        }
      }
    })
    rendition.on('locationChanged', onLocationChange)
    rendition.on('displayError', (error: Error) => {
      if (request === loadRequest) onLoadError(error)
    })
    if (handleTextSelected) {
      rendition.on('selected', handleTextSelected)
    }
    if (handleKeyPress) {
      rendition.on('keypress', handleKeyPress)
    }
  }
}

const onLocationChange = (loc: { start: string }) => {
  //监听翻页
  const newLocation = loc.start
  if (getLocation(location.value) !== newLocation) {
    emit('update:location', newLocation)
  }
}

watch(url, initBook)

watch(
  () => getLocation(location.value),
  (href) => {
    if (href === undefined || href === '' || !rendition || isError.value) return
    // 翻页事件回传给 v-model 时，当前位置已经更新，无需再次跳转。
    if (href === rendition.location?.start.cfi) return
    const request = loadRequest
    setLocation(href)?.catch((error) => {
      if (request === loadRequest) onLoadError(error)
    })
  }
)

const nextPage = () => {
  return rendition?.next()
}

const prevPage = () => {
  return rendition?.prev()
}

const setLocation = (href: number | string) => {
  if (typeof href === 'string') {
    return rendition?.display(href)
  } else {
    return rendition?.display(href)
  }
}

onMounted(() => {
  initBook()
})

onUnmounted(() => {
  loadRequest++
  cleanupIframeListeners()
  book?.destroy()
  book = null
  rendition = null
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
