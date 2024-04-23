<template>
  <div class="container">
    <div class="readerArea" :class="{ containerExpanded: expandedToc }">
      <!--展开目录 -->
      <button
        v-if="showToc"
        class="tocButton"
        :class="{ tocButtonExpanded: expandedToc }"
        type="button"
        @click="toggleToc"
      >
        <span class="tocButtonBar" style="top: 35%"></span>
        <span class="tocButtonBar" style="top: 66%"></span>
      </button>
      <!-- 书名 -->
      <slot name="title">
        <div class="titleArea">{{ title || bookName }}</div>
      </slot>
      <!-- 阅读 -->
      <epub-view
        ref="epubRef"
        v-bind="$attrs"
        :url="url"
        :tocChanged="onTocChange"
        :getRendition="onGetRendition"
      >
        <template #loadingView>
          <slot name="loadingView">
            <div class="loadingView">Loading…</div>
          </slot>
        </template>
      </epub-view>
      <!-- 翻页 -->
      <button
        class="arrow pre"
        @click="pre"
        :disabled="currentLocation?.atStart"
      >
        ‹
      </button>
      <button
        class="arrow next"
        @click="next"
        :disabled="currentLocation?.atEnd"
      >
        ›
      </button>
    </div>
    <!-- 目录 -->
    <div v-if="showToc">
      <div class="tocArea">
        <TocComponent
          :toc="toc"
          :current="currentHref"
          :setLocation="setLocation"
        />
      </div>
      <!-- 目录遮罩 -->
      <div v-if="expandedToc" class="tocBackground" @click="toggleToc"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  toRefs,
  reactive,
  defineComponent,
  getCurrentInstance,
  type PropType,
  onBeforeUnmount,
  version,
  Transition,
  onUnmounted,
  h as _h,
} from 'vue-demi'
import { Rendition, Book } from 'epubjs'
import EpubView from '../EpubView/EpubView.vue'

//目录
interface TocProps {
  toc: Array<NavItem>
  current: String | Number
  setLocation: (href: string | number, close?: boolean) => void
  isSubmenu?: boolean
}

const TocComponent = defineComponent({
  name: 'TocComponent',

  emits: {
    progress(percentage: number) {
      return true
    },
  },

  props: {
    toc: {
      type: Array as PropType<Array<NavItem>>,
      default: () => [],
    },
    current: {
      type: [String, Number],
      default: '',
    },
    setLocation: {
      type: Function as PropType<TocProps['setLocation']>,
      required: true,
    },
    isSubmenu: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  setup(props) {
    const vm = getCurrentInstance()
    const h = _h.bind(vm)

    const { setLocation, isSubmenu } = props
    const { toc, current } = toRefs(props)

    return () =>
      h(
        'div',
        null,
        toc.value.map((item, index) => {
          return h('div', { key: index }, [
            h(
              'button',
              {
                class: [
                  'tocAreaButton',
                  item.href === current!.value ? 'active' : '',
                ],
                onClick: () => {
                  if (item.subitems.length > 0) {
                    item.expansion = !item.expansion
                    setLocation(item.href, false)
                  } else {
                    setLocation(item.href)
                  }
                },
              },
              [
                isSubmenu ? ' '.repeat(4) + item.label : item.label,
                // 展开
                item.subitems &&
                  item.subitems.length > 0 &&
                  h('div', {
                    class: `${item.expansion ? 'open' : ''} expansion`,
                  }),
              ]
            ),
            //多级目录
            item.subitems &&
              item.subitems.length > 0 &&
              h(
                Transition,
                { name: 'collapse-transition' },
                {
                  default: () =>
                    h(
                      'div',
                      {
                        style: {
                          display: item.expansion ? undefined : 'none',
                        },
                      },
                      [
                        h(TocComponent, {
                          toc: item.subitems,
                          current: current.value,
                          setLocation,
                          isSubmenu: true,
                        }),
                      ]
                    ),
                }
              ),
          ])
        })
      )
  },
})
interface NavItem {
  id: string
  href: string
  label: string
  subitems: Array<NavItem>
  parent?: string
  expansion: boolean
}

interface Props {
  url: string | ArrayBuffer
  title?: string
  showToc?: boolean
  tocChanged?: (toc: Book['navigation']['toc']) => void
  getRendition?: (rendition: Rendition) => void
}

const emit = defineEmits(['progress'])

const epubRef = ref<InstanceType<typeof EpubView>>()
const currentLocation = ref<Rendition['location'] | null>(null)
const currentHref = ref<string | number | null>(null)

const props = withDefaults(defineProps<Props>(), {
  showToc: true,
})

const { tocChanged, getRendition } = props

const { title, url } = toRefs(props)

interface EpubBook {
  toc: Array<NavItem>
  expandedToc: boolean
}
const book: EpubBook = reactive({
  toc: [], //目录
  expandedToc: false, //目录展开
})
const { toc, expandedToc } = toRefs(book)

const bookName = ref('')

const toggleToc = () => {
  expandedToc.value = !expandedToc.value
}

const onTocChange = (_toc) => {
  toc.value = _toc.map((i) => ({ ...i, expansion: false }))
  tocChanged && tocChanged(_toc)
}

const onGetRendition = (rendition) => {
  getRendition && getRendition(rendition)
  rendition.on('relocated', (location) => {
    currentLocation.value = location
    currentHref.value = location.start.href
  })
  const book = rendition.book
  book.ready.then(() => {
    const meta = book.package.metadata
    bookName.value = meta.title
  })
}

const setLocation = (href: string | number,close: boolean = true) => {
  epubRef?.value?.setLocation(href)
  currentHref.value = href
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
  if (requestUrl === url.value) {
    this.addEventListener('progress', onProgress)
  }
  originalOpen.apply(this, arguments as any)
}

onUnmounted(() => {
  XMLHttpRequest.prototype.open = originalOpen
})

const next = epubRef.value?.nextPage
const pre = epubRef.value?.prevPage
</script>
<style>
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
  position: relative;
}

.tocArea .tocAreaButton:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tocArea .tocAreaButton:active {
  background: rgba(0, 0, 0, 0.1);
}

.tocArea .active {
  color: #1565c0;
  border-bottom: 2px solid #1565c0;
}

/* 二级目录 */
.tocArea .tocAreaButton .expansion {
  cursor: pointer;
  transform: translateY(-50%);
  top: 50%;
  right: 12px;
  position: absolute;
  width: 10px;
  background-color: #a2a5b4;
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
}

.tocArea .tocAreaButton .expansion::after,
.tocArea .tocAreaButton .expansion::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background-color: currentcolor;
  border-radius: 2px;
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
}
/* ↓ */
.tocArea .tocAreaButton .expansion::before {
  transform: rotate(-45deg) translateX(2.5px);
}

.tocArea .tocAreaButton .expansion::after {
  transform: rotate(45deg) translateX(-2.5px);
}
/* ↑ */
.tocArea .tocAreaButton .open::before {
  transform: rotate(45deg) translateX(2.5px);
}

.tocArea .tocAreaButton .open::after {
  transform: rotate(-45deg) translateX(-2.5px);
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
</style>
