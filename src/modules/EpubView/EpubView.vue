<template>
  <div class="reader">
    <div class="viewHolder">
      <div ref="viewer" id="viewer" v-show="isLoaded"></div>
      <div v-if="!isLoaded">
        <slot name="loadingView"> </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//http://epubjs.org/documentation/0.3/
//https://github.com/johnfactotum/foliate-js
import { ref, onMounted, onUnmounted, watch, unref } from 'vue'
import ePub, { Book, Rendition, Contents, Location, NavItem } from 'epubjs'
import {
  clickListener,
  swipListener,
  wheelListener,
  keyListener,
} from '../utils/listener/listener'

interface Props {
  url: string | ArrayBuffer
  location?: number | string | Location['start']
  tocChanged?: (toc: Array<NavItem>) => void
  getRendition?: (rendition: Rendition) => void
  handleTextSelected?: (cfiRange: string, contents: Contents) => void
  handleKeyPress?: () => void
  epubInitOptions?: Book['settings']
  epubOptions?: Rendition['settings']
}
const {
  url,
  location,
  tocChanged,
  getRendition,
  handleTextSelected,
  handleKeyPress,
  epubInitOptions = {},
  epubOptions = {},
} = defineProps<Props>()

const emit = defineEmits<{
  'update:location': Location['start']
}>()

const viewer = ref<HTMLDivElement | null>(null)
const toc = ref<Array<NavItem>>([])
const isLoaded = ref(false)
let book: null | Book = null,
  rendition: null | Rendition = null

const initBook = async () => {
  if (book) book.destroy()
  if (url) {
    book = ePub(unref(url), epubInitOptions)
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
  if (typeof location === 'string') {
    rendition.display(location)
  } else if (typeof location === 'number') {
    rendition.display(location)
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
      iframe?.iframe?.contentWindow.focus()
      // clickListener(iframe?.document, rendition as Rendition, flipPage);
      // selectListener(iframe.document, rendition, toggleBuble);
      if (!epubOptions?.flow?.includes('scrolled'))
        wheelListener(iframe.document, flipPage)
      swipListener(iframe.document, flipPage)
      keyListener(iframe.document, flipPage)
    })
    rendition.on('locationChanged', onLocationChange)
    rendition.on('displayError', () => console.error('error rendering book'))
    if (handleTextSelected) {
      rendition.on('selected', handleTextSelected)
    }
    if (handleKeyPress) {
      rendition.on('selected', handleKeyPress)
    }
  }
}

const onLocationChange = (loc: Location) => {
  //监听翻页
  const newLocation = loc.start
  if (location !== newLocation) {
    emit('update:location',loc.start)
  }
}

watch(() => url, initBook)

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
