# 在图书中搜索

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
    <div class="search">
      <input v-model.trim="searchText" placeholder="搜索" @keyup.enter="search" />
      <div class="searchResults">
        <div v-if="!searchResults.length">暂无结果</div>
        <div class="item" v-for="item in searchResults" :key="item.cfi" @click="go(item.cfi)">
          <span>{{ item.excerpt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

let rendition
let highlights = []
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])

const getRendition = (val) => (rendition = val)

// epub.js 没有内置搜索，需要逐个加载篇目再查找
const search = async () => {
  const q = searchText.value
  highlights.forEach((cfi) => rendition?.annotations.remove(cfi, 'highlight'))
  highlights = []
  searchResults.value = []
  if (!q || !rendition) return

  const { book } = rendition
  searchResults.value = (await Promise.all(
    book.spine.spineItems.map((item) =>
      item.load(book.load.bind(book)).then(() => item.find(q)).finally(() => item.unload())
    )
  )).flat()
  highlights = searchResults.value.map(({ cfi }) => cfi)
  highlights.forEach((cfi) => rendition.annotations.add('highlight', cfi))
}

const go = (cfi) => rendition.display(cfi)
</script>
<style scoped>
.search {
  position: absolute;
  inset: auto 1rem 1rem;
  z-index: 1;
  display: flex;
  justify-content: center;
  background: #fff;
}

.searchResults {
  width: 200px;
}

.item {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid;
}

</style>
```

:::
