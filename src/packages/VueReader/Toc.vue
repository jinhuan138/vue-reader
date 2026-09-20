<template>
  <div v-for="(item, index) in bookToc" :key="index">
    <button class="tocAreaButton" :class="{ active: item.id === current }"
      @click="handleClick(item)">
      {{ isSubmenu ? ' '.repeat(4) + item.label : item.label }}
      <div v-if="item.subitems && item.subitems.length > 0" class="expansion" :class="{ open: item.expansion }"></div>
    </button>
    <div v-if="item.subitems && item.subitems.length > 0" v-show="item.expansion">
      <!-- 子目录 -->
      <Toc :toc="item.subitems" :current="current" :setLocation="setLocation" :isSubmenu="true" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { EpubCFI } from 'epubjs'
import type { Book, Location, NavItem } from 'epubjs'
import { computed, ref, watch, toRefs } from 'vue'
export interface Item extends NavItem {
  expansion: boolean
}
export interface TocProps {
  toc: Array<NavItem>
  book?: Book | null
  currentLocation?: Location | null
  current?: string
  setLocation: (href: string | number, close?: boolean) => void
  isSubmenu?: boolean
}
const bookToc = ref<Item[]>([])
interface TocLocation {
  id: string
  cfi: string
}

const tocLocations = ref<TocLocation[]>([])
let tocLocationRequest = 0
const props = withDefaults(defineProps<TocProps>(), {
  isSubmenu: false,
})
const { setLocation } = props
const { toc, book, currentLocation, isSubmenu } = toRefs(props)
const current = computed(() => {
  if (isSubmenu.value) return props.current

  const currentCfi = currentLocation.value?.start.cfi
  if (!currentCfi || tocLocations.value.length === 0) return undefined

  const epubCfi = new EpubCFI()
  let active: TocLocation | undefined

  tocLocations.value.forEach((location) => {
    try {
      if (
        epubCfi.compare(location.cfi, currentCfi) <= 0 &&
        (!active || epubCfi.compare(active.cfi, location.cfi) <= 0)
      ) {
        active = location
      }
    } catch {
      // 跳过无法解析 CFI 的目录项，避免单个异常目录影响阅读器。
    }
  })

  return active?.id
})
const handleClick = (item: Item): void => {
  if (item.subitems && item?.subitems?.length > 0) {
    item.expansion = !item.expansion
    setLocation(item.href, false)
  } else {
    setLocation(item.href)
  }
}

watch(
  toc,
  (newToc) => {
    // 构建已有展开状态的 Map，按 href 索引
    const expandMap = new Map(bookToc.value.map((item) => [item.href, item.expansion]))
    bookToc.value = newToc.map((item) => ({
      ...item,
      // 已有状态则保留，新增的项默认 false
      expansion: expandMap.get(item.href) ?? false,
    }))
  },
  { immediate: true }
)

const loadTocLocations = async (currentBook: Book, items: Array<NavItem>) => {
  const request = ++tocLocationRequest
  const locations: TocLocation[] = []

  const walk = async (tocItems: Array<NavItem>) => {
    for (const item of tocItems) {
      const hashIndex = item.href.indexOf('#')
      const spineHref = hashIndex === -1 ? item.href : item.href.slice(0, hashIndex)
      const fragment = hashIndex === -1 ? '' : item.href.slice(hashIndex + 1)
      const section = currentBook.spine.get(spineHref)

      if (section) {
        const wasLoaded = Boolean(section.document)

        try {
          if (!wasLoaded) await section.load(currentBook.load.bind(currentBook))
          const id = fragment ? decodeURIComponent(fragment) : ''
          const element = id ? section.document.getElementById(id) : section.document.body

          if (element) locations.push({ id: item.id, cfi: section.cfiFromElement(element) })
        } catch {
          // 部分 EPUB 的目录目标可能不存在，保留其余可解析的目录项。
        } finally {
          if (!wasLoaded) section.unload()
        }
      }

      if (item.subitems?.length) await walk(item.subitems)
    }
  }

  await walk(items)
  if (request === tocLocationRequest) tocLocations.value = locations
}

watch(
  [toc, book],
  ([items, currentBook]) => {
    if (isSubmenu.value) return

    tocLocationRequest++
    tocLocations.value = []
    if (currentBook) loadTocLocations(currentBook, items)
  },
  { immediate: true }
)

const containsCurrentItem = (items: Array<NavItem>, id: string): boolean =>
  items.some((item) => item.id === id || (item.subitems && containsCurrentItem(item.subitems, id)))

watch(
  current,
  (id) => {
    if (!id) return

    bookToc.value.forEach((item) => {
      if (item.subitems && containsCurrentItem(item.subitems, id)) item.expansion = true
    })
  },
  { immediate: true }
)
</script>
<style scoped>
/* ↓ */
.tocAreaButton .expansion::before {
  transform: rotate(-45deg) translateX(2.5px);
}

.tocAreaButton .expansion::after {
  transform: rotate(45deg) translateX(-2.5px);
}

/* ↑ */
.tocAreaButton .open::before {
  transform: rotate(45deg) translateX(2.5px);
}

.tocAreaButton .open::after {
  transform: rotate(-45deg) translateX(-2.5px);
}

.tocAreaButton {
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

.tocAreaButton:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tocAreaButton:active {
  background: rgba(0, 0, 0, 0.1);
}

.active {
  color: #1565c0;
  border-bottom: 2px solid #1565c0;
}

/* 二级目录 */
.tocAreaButton .expansion {
  cursor: pointer;
  transform: translateY(-50%);
  top: 50%;
  right: 12px;
  position: absolute;
  width: 10px;
  background-color: #a2a5b4;
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
}

.tocAreaButton .expansion::after,
.tocAreaButton .expansion::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background-color: currentcolor;
  border-radius: 2px;
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
}
</style>
