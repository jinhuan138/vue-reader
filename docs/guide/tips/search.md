# Search in the book

:::demo

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader url="/vue-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
    <div class="search">
      <input
        v-model.trim="searchText"
        placeholder="search"
        @keyup.enter="search"
      />
      <div class="searchResults">
        <div v-if="!searchResults.length">Empty</div>
        <div
          class="item"
          v-for="(item, index) in searchResults"
          :key="index"
          @click="go(item.cfi, $event)"
        >
          <span
            v-html="
              item.excerpt
                .trim()
                .replace(
                  searchText,
                  `<span style='color: orange;'>${searchText}</span>`
                )
            "
          >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

let rendition = null
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])

const getRendition = (val) => (rendition = val)

const search = async () => {
  if (!searchText.value) return (searchResults.value = [])
  const res = await doSearch(searchText.value)
  searchResults.value = res.slice(0, 5)
}

//Searching the entire book
const doSearch = (q) => {
  const { book } = rendition
  return Promise.all(
    book.spine.spineItems.map((item) =>
      item
        .load(book.load.bind(book))
        .then(item.find.bind(item, q))
        .finally(item.unload.bind(item))
    )
  ).then((results) => Promise.resolve([].concat.apply([], results)))
}

//Searching the current chapter
const doChapterSearch = (q) => {
  const { book } = rendition
  let item = book.spine.get(rendition.location.start.cfi)
  return item
    .load(book.load.bind(book))
    .then(item.find.bind(item, q))
    .finally(item.unload.bind(item))
}

const go = (href, e) => {
  rendition.display(href)
  e.stopPropagation()
  e.preventDefault()
}
</script>
<style scoped>
.search {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  text-align: center;
  z-index: 1;
  color: #000;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search .searchResults {
  width: 200px;
}

.search .searchResults .item {
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid #000;
}

.search .searchResults .item:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
```

:::