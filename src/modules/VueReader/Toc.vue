<template>
  <div v-for="(item, index) in bookToc" :key="index">
    <button class="tocAreaButton" :class="{ active: item.href.split('#')[0] === current?.start.href }"
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
import { NavItem, Location } from 'epubjs'
import { ref, watchEffect } from 'vue'
interface Item extends NavItem {
  expansion: boolean
}
interface TocProps {
  toc: Array<NavItem>
  current: Location | null
  setLocation: (href: string | number, close?: boolean) => void
  isSubmenu?: boolean
}
const bookToc = ref<Item[]>([])
const { toc, current, setLocation, isSubmenu = false } = defineProps<TocProps>()
const handleClick = (item: Item): void => {
  if (item.subitems && item?.subitems?.length > 0) {
    item.expansion = !item.expansion
    setLocation(item.href, false)
  } else {
    setLocation(item.href)
  }
}
watchEffect(() => {
  bookToc.value = toc.map((item) => ({
    ...item,
    expansion: false,
  }))
})
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
