<template>
  <el-container
    class="reader-container"
    direction="vertical"
    style="z-index: 999; background-color: #fff"
  >
    <titlebar :title="title">
      <el-button-group>
        <el-button size="small" :icon="Back" circle @click="onBackBtn" />
        <el-button size="small" :icon="Grid" circle @click="onLibraryBtn" />
      </el-button-group>

      <toc-menu :toc="currentBook.toc" @node-click="onNodeClick"></toc-menu>

      <bookmark-menu
        :bookmarks="currentBook.bookmarks"
        @node-click="onNodeClick"
        @add-bookmark="addBookmark"
        @remove-bookmark="removeBookmark"
      />

      <search-menu
        :search-result="searchResult"
        @node-click="onNodeClick"
        @search="search"
      />

      <theme-menu
        @theme-change="applytheme"
        @flow-change="applyflow"
        @style-change="updateStyle"
      />
    </titlebar>

    <el-main class="container">
      <EpubView
        id="reader"
        :url="url"
        :getRendition="getRendition"
        :title="page"
        v-loading="!isReady"
        :epubOptions="{
          allowPopups: true,
          allowScriptedContent: true,
        }"
        @update:location="locationChange"
      >
        <template #loadingView>
          <el-progress :percentage="loadProcess" />
        </template>
      </EpubView>
      <vue-easy-lightbox
        :visible="visibleRef"
        :imgs="imgsRef"
        :index="indexRef"
        @hide="visibleRef = false"
      ></vue-easy-lightbox>
    </el-main>

    <el-footer height="45">
      <div class="page-controls">
        <el-button
          :icon="ArrowLeft"
          circle
          title="上一页"
          :disabled="atStart"
          @click="prevPage"
        />
        <el-slider
          v-model="sliderValue"
          :step="0.01"
          :format-tooltip="labelFromPercentage"
          @change="onSliderValueChange"
        />
        <el-button
          :icon="ArrowRight"
          circle
          title="下一页"
          :disabled="atEnd"
          @click="nextPage"
        />
      </div>
    </el-footer>

    <buble-menu ref="bubleMenu" @highlight-btn-click="highlightSelection" />
  </el-container>
</template>
<script setup>
//https://github.com/code-farmer-i/vue-markdown-editor.git
//https://github.com/hepengwei/visualization-collection
import { db } from './utils/db'
import { ArrowLeft, ArrowRight, Back, Grid } from '@element-plus/icons-vue'
import { EpubView } from 'vue-reader'
import titlebar from './Titlebar.vue'
import TocMenu from './menu/TocMenu.vue'
import BookmarkMenu from './menu/BookmarkMenu.vue'
import SearchMenu from './menu/SearchMenu.vue'
import ThemeMenu from './menu/ThemeMenu.vue'
import BubleMenu from './menu/BubleMenu.vue'
// import selectListener from '../../packages/utils/listener/select'
import { getInfo } from './utils/dbUtilis'
import { dark, tan } from './utils/themes'
import { useReaderStore } from './utils/stores'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'

const reader = useReaderStore()

const props = defineProps({
  bookInfo: {
    type: [Object],
  },
})
const isReady = ref(false)
const atStart = ref(false)
const atEnd = ref(false)
const currentBook = ref({})
const title = ref('')
const url = computed(() => {
  if (!props.bookInfo.url) {
    // const info = await db.books.get(props.bookInfo);
    return props.bookInfo
  } else {
    return `${import.meta.env.BASE_URL}files/${props.bookInfo.url}`
  }
})
let rendition = null,
  flattenedToc = null
let relocatedHandler = null

const imgsRef = ref([])
const indexRef = ref(0)
const visibleRef = ref(false)

const getRendition = (val) => {
  rendition = val
  const book = rendition.book
  // const displayed = rendition.display();
  rendition.on('rendered', (e, iframe) => {
    // selectListener(iframe.document, rendition, toggleBuble)
  })
  relocatedHandler = (location) => {
    atStart.value = Boolean(location.atStart)
    atEnd.value = Boolean(location.atEnd)

    if (!book.locations.length()) return
    const percentage = book.locations.percentageFromCfi(location.start.cfi)
    if (!Number.isFinite(percentage) || percentage < 0) return

    progress.value = percentage
    sliderValue.value = Math.round(percentage * 10000) / 100

    if (currentBook.value?.id) {
      currentBook.value.lastCfi = location.start.cfi
      currentBook.value.progress = percentage
      reader.setBook(currentBook.value.id, currentBook.value)
    }
  }
  rendition.on('relocated', relocatedHandler)
  rendition.hooks.content.register(applyStyle)

  rendition.hooks.content.register(({ document }) => {
    //hover 显示注释
    const annotation = Array.from(document.querySelectorAll('a'))
    if (annotation.length) {
      const halfLength = Math.floor(annotation.length / 2)
      annotation.slice(0, halfLength).forEach((el) => {
        if (el.href) {
          const id = el.href.split('#')[1]
          const target = annotation.find((a) => a.id === id)
          if (target && target.parentNode) {
            el.title = target.parentNode.textContent
          }
        }
      })
    }
    //图片查看
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
      imgsRef.value.push(img.src || img.getAttribute('xlink:href'))
    })
  })

  book.ready
    .then(async () => {
      const meta = book.package.metadata
      console.log(book.package.metadata)
      title.value = meta.title
      rendition.themes.registerRules('dark', dark)
      rendition.themes.registerRules('tan', tan)
      rendition.ready = true
      //applytheme
      const { theme, flow } = reader
      applytheme(theme)
      applyflow(flow)
      await getInfo(url.value, book, (info) => {
        const sourceBook = props.bookInfo?.url ? props.bookInfo : {}
        currentBook.value = {
          ...sourceBook,
          ...info,
          id: sourceBook.id,
          url: sourceBook.url,
          bookmarks: sourceBook.bookmarks || [],
          highlights: sourceBook.highlights || [],
        }
        flattenedToc = (function flatten(items) {
          return [].concat(
            ...items.map((item) => [item].concat(...flatten(item.children)))
          )
        })(info.toc)
        flattenedToc.sort((a, b) => {
          return a.percentage - b.percentage
        })
      })

      if (currentBook.value.lastCfi) {
        await rendition.display(currentBook.value.lastCfi)
      }

      const currentLocation = rendition.currentLocation()
      if (currentLocation?.start) {
        relocatedHandler(currentLocation)
        locationChange(currentLocation.start.cfi)
      }
    })
    .then(() => {
      isReady.value = true
      // this.info.highlights.forEach(cfiRange => {
      //     rendition.annotations.highlight(cfiRange);
      // });
    })
}
const page = ref('')
const locationChange = (epubcifi) => {
  //翻页
  if (epubcifi) {
    const { displayed, href } = rendition.location.start
    if (href !== 'titlepage.xhtml') {
      const label = labelFromPercentage(progress.value * 100)
      page.value = `${displayed.page}/${displayed.total}${
        label ? ` ${label}` : ''
      }`
    }
  }
  //存储
  // if (!firstRenderDone.value) {
  //     location.value = localStorage.getItem(book)
  //     return firstRenderDone.value = true
  // }
  // localStorage.setItem(book, epubcifi)
}
//info

// const info = ref(props.bookInfo)
onMounted(() => {
  // info.value.lastOpen = new Date().getTime();
  // reader.setBook(info.id, info)
})
onBeforeUnmount(() => {
  if (rendition && relocatedHandler) {
    rendition.off('relocated', relocatedHandler)
  }
  stopTrackingDownloads?.()
})

//阅读进度
const sliderValue = ref(0)
const progress = ref(0)
const labelFromPercentage = (percent) => {
  return tocFromPercentage(percent)?.label ?? ''
}

const tocFromPercentage = (percent) => {
  if (!flattenedToc?.length) return null

  const target = Math.max(0, Math.min(100, Number(percent) || 0)) / 100
  let current = flattenedToc[0]

  for (const item of flattenedToc) {
    if (item.percentage > target) break
    current = item
  }

  return current
}
const onSliderValueChange = (val) => {
  if (!rendition || !Number.isFinite(Number(val))) return
  const cfi = rendition.book.locations.cfiFromPercentage(Number(val) / 100)
  if (!cfi) return
  rendition.display(cfi)
}
const prevPage = () => rendition?.prev()
const nextPage = () => rendition?.next()
//加载进度
const loadProcess = ref(0)
const trackAllDownloads = (onProgress) => {
  if (typeof XMLHttpRequest === 'undefined') return null

  const open = XMLHttpRequest.prototype.open
  const trackedOpen = function () {
    this.addEventListener(
      'progress',
      function (event) {
        if (event.lengthComputable) {
          onProgress(event.loaded / event.total)
        }
      },
      false
    )
    open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.open = trackedOpen

  return () => {
    if (XMLHttpRequest.prototype.open === trackedOpen) {
      XMLHttpRequest.prototype.open = open
    }
  }
}
// 监听所有下载进度并显示进度条
const stopTrackingDownloads = trackAllDownloads((_progress) => {
  loadProcess.value = Math.round(_progress * 100)
})
//header
const emit = defineEmits(['update:showReader', 'theme-change'])

const goHome = () => {
  emit('update:showReader', false)
}

const onBackBtn = goHome
const onLibraryBtn = goHome

const onNodeClick = (item) => {
  const target = item?.cfi || item?.href
  if (rendition && target) rendition.display(target)
}
//theme
const styleRules = ref({})
const applytheme = (val) => {
  // theme.value = val;
  rendition.themes.select(val)
  reader.theme = val
  refreshRendition()
  emit('theme-change', val)
}
const applyflow = (flow) => {
  if (!rendition.ready) return
  rendition.flow(flow)
}
const updateStyle = (rules) => {
  styleRules.value = rules
  applyStyle()
  refreshRendition()
}
const refreshRendition = () => {
  // re-render to apply theme properly
  if (rendition && rendition.manager) {
    rendition.start()
  }
}
const applyStyle = () => {
  if (!rendition) return
  rendition.getContents().forEach((content) => {
    content.addStylesheetRules(styleRules.value)
  })
}
//search
const searchResult = ref([])
const search = (text) => {
  if (!text) {
    searchResult.value = []
    return Promise.resolve([])
  }
  const book = rendition.book
  return Promise.all(
    book.spine.spineItems.map((item) =>
      item
        .load(book.load.bind(book))
        .then(item.find.bind(item, text))
        .finally(item.unload.bind(item))
    )
  )
    .then((results) => results.flat())
    .then((results) => {
      searchResult.value = results.map((result) => {
        result.label = result.excerpt
        return result
      })
    })
    .then(() => {
      // this.$remote.getCurrentWebContents().findInPage(text);
    })
}
//highlight
const bubleMenu = ref(null)
const toggleBuble = (event, react, text, cfiRange) => {
  if (event === 'cleared') {
    // hide buble
    // this.buble.hide();
    bubleMenu.value.hide()
    return
  }
  console.log(bubleMenu.value)
  bubleMenu.value.setProps(react, text, cfiRange)
  bubleMenu.value.isBubleVisible = true
  // this.buble.setProps(react, text, cfiRange);
  // this.isBubleVisible = true;
}
const highlightSelection = (cfiRange) => {
  rendition.annotations.highlight(cfiRange)
  // this.info.highlights.push(cfiRange);
  // this.$db.set(this.info.id, this.info);
}
//bookmark
const addBookmark = () => {
  /**
   * prefred structure of bookmark object
   *  let bookmark = {
   *  title:'',// title of page of topic where bookmark is placed
   *  cfi:'', // cfi of location
   *  href:'' // href of location
   * }
   */
  if (!rendition) return

  const { location } = rendition
  if (!location?.start) return
  const { href, cfi, percentage } = location.start

  // TODO : find more minigful name for bookmark
  const bookmarkTitle = `${labelFromPercentage(percentage * 100)} : At ${
    Math.floor(progress.value * 1000) / 10
  }%`

  const bookmark = {
    label: bookmarkTitle,
    cfi,
    href,
  }
  const bookmarks =
    currentBook.value.bookmarks || (currentBook.value.bookmarks = [])
  if (!bookmarks.some((item) => item.cfi === bookmark.cfi)) {
    bookmarks.push(bookmark)
    if (currentBook.value.id)
      reader.setBook(currentBook.value.id, currentBook.value)
  }
  // this.$db.set(this.info.id, this.info);
}
const removeBookmark = (bookmark) => {
  const bookmarks = currentBook.value.bookmarks
  if (!bookmarks) return
  const index = bookmarks.findIndex((item) => item.cfi === bookmark.cfi)
  if (index > -1) {
    bookmarks.splice(index, 1)
    if (currentBook.value.id)
      reader.setBook(currentBook.value.id, currentBook.value)
  }
  // this.$db.insert(this.info.id, this.info);
}
</script>

<style scoped lang="scss">
.reader-container {
  width: 100%;
  height: 100%;
  min-width: 0;
}

.container {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0;
  overflow: hidden;
}

.page-controls {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 12px;
}

.page-controls .el-slider {
  min-width: 0;
  flex: 1;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  margin: 5px;
}

#reader {
  user-select: none;
  height: 100%;
  width: 100%;
  position: relative;
  inset: 0;
}
</style>
