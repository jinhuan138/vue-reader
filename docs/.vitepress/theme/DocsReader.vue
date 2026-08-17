<template>
  <div id="docs-reader" :class="'reader-' + reader.theme">
    <Home v-if="page === 'home'" @update:current-book="openBook" />
    <Reader
      v-else-if="page === 'view' && currentBook"
      :book-info="currentBook"
      @update:show-reader="goHome"
    />
  </div>
</template>

<script>
let localBook
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import Home from '../../../reader/src/components/Home.vue'
import Reader from '../../../reader/src/components/Reader.vue'
import { useReaderStore } from '../../../reader/src/components/utils/stores'

defineProps({ page: String })

const router = useRouter()
const reader = useReaderStore()
const currentBook = ref()
const homePath = withBase('/reader/home')

const openBook = (book) => {
  localBook = book?.id ? undefined : book
  const bookId = book?.id || 'local'
  router.go(withBase(`/reader/view?bookId=${encodeURIComponent(bookId)}`))
}

const goHome = () => router.go(homePath)

onMounted(() => {
  if (location.pathname.replace(/\/$/, '').endsWith('/reader/view')) {
    const bookId = new URLSearchParams(location.search).get('bookId')
    currentBook.value = bookId === 'local'
      ? localBook
      : reader.bookList.find((book) => String(book.id) === bookId)
    if (!currentBook.value) goHome()
  }
})
</script>

<style scoped>
#docs-reader {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: none;
  height: 100vh;
  overflow: hidden;
}
</style>
