<template>
    <div class="container">
        <div class="vueContainer">
            <VueReader :location="location" :url="url" @update:location="locationChange"
                :getRendition="val => rendition = val" :tocChanged="val => toc = val">
            </VueReader>
            <div class="page">
                {{ page }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
import { useRoute } from 'vue-router'
import { ref } from "vue";

const route = useRoute()
console.log(route)
const book = route.params.name
const defaultBook = '啼笑因缘'
const url = ref(book.endsWith('.epub') ? `/books/${book}` : `/files/${defaultBook}.epub`)
const rendition = ref(null)
const location = ref(2)
const toc = ref([])
const page = ref('')
const firstRenderDone = ref(false)

const locationChange = (epubcifi) => {
    //翻页
    const getLabel = (toc, href) => {
        let label = 'n/a';
        toc.some(item => {
            if (item.subitems.length > 0) {
                const subChapter = getLabel(item.subitems, href);
                if (subChapter !== 'n/a') {
                    label = subChapter
                    return true
                }
            } else if (item.href.includes(href)) {
                label = item.label
                return true
            }
        })
        return label;
    }
    if (epubcifi) {
        const { displayed, href } = rendition.value.location.start
        const { cfi } = rendition.value.location.end
        if (href !== 'titlepage.xhtml') {
            const label = getLabel(toc.value, href)
            page.value = `${displayed.page}/${displayed.total} ${label}`
        }
    }
    //存储
    if (!firstRenderDone.value) {
        location.value = localStorage.getItem(book)
        return firstRenderDone.value = true
    }
    localStorage.setItem(book, epubcifi)
}
</script>
  
<style scoped>
.container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
    overflow: hidden;
}

.vueContainer {
    font-size: 16px;
    position: absolute;
    top: 0px;
    left: 0rem;
    right: 0rem;
    bottom: 0rem;
}

.page {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
}
</style>
  