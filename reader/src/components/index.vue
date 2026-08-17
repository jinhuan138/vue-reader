<template>
  <div id="index" :class="'reader-' + reader.theme">
    <RouterView v-slot="{ Component }">
      <transition name="el-fade-in-linear" mode="out-in">
        <component
          :is="Component"
          :book-info="currentBook"
          @update:current-book="openBook"
          @update:show-reader="closeReader"
        />
      </transition>
    </RouterView>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useReaderStore } from './utils/stores'

const reader = useReaderStore()
const route = useRoute()
const router = useRouter()
const currentBook = ref({})
const hasLocalBookSession = ref(false)

const restoreBookFromRoute = () => {
  const bookId = route.query.bookId
  if (!bookId) {
    currentBook.value = {}
    hasLocalBookSession.value = false
    if (route.name === 'view') router.replace({ name: 'home' })
    return
  }

  if (bookId === 'local') {
    if (!hasLocalBookSession.value) router.replace({ name: 'home' })
    return
  }

  const book = reader.bookList.find((item) => String(item.id) === bookId)
  if (!book) {
    router.replace({ name: 'home' })
    return
  }

  currentBook.value = book
}

const openBook = (bookInfo) => {
  currentBook.value = bookInfo
  hasLocalBookSession.value = !bookInfo?.id
  router.push({ name: 'view', query: { bookId: bookInfo?.id || 'local' } })
}

const closeReader = () => {
  hasLocalBookSession.value = false
  router.push({ name: 'home' })
}

watch(
  () => [route.name, route.query.bookId],
  restoreBookFromRoute,
  { immediate: true }
)
</script>
<style lang="scss" scoped>
$border-radius: 4px;
$margin: 4px;
$padding: 4px;

#index {
  width: 100% !important;
  height: 100vh;
  border-radius: $border-radius;
}
</style>

<style lang="scss">
::-webkit-scrollbar {
}

html,
body {
  margin: 0px;
  width: 100%;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.el-container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
}

.el-main {
  width: 100%;
  height: 100%;
  padding: 0px;
}

.el-button {
  border: none;
}

.el-table,
.el-table *,
.el-radio-button__inner,
.el-tree,
.el-button {
  background: inherit !important;
  color: inherit !important;
}

.reader-default {
  width: 100%;
  background: #fff !important;
  color: #555 !important;
}

.reader-dark {
  width: 100% !important;
  background: #444 !important;
  color: #eee !important;
}

.reader-tan {
  width: 100% !important;
  background: #fdf6e3 !important;
  color: #002b36 !important;
}
</style>
