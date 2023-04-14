<template>
    <div style="height: 100vh">
        <VueReader url="/files/啼笑因缘.epub" :getRendition="val => rendition = val" :tocChanged="val => toc = val"
            @update:location="locationChange">
        </VueReader>
        <div class="page">
            {{ page }}
        </div>
    </div>
</template>
<script setup>
import { ref, markRaw, onMounted } from "vue";
import { VueReader } from "vue-reader"

let rendition = markRaw({})
onMounted(() => {
    setTimeout(() => {
        console.log(rendition)
        console.log(location)
    }, 2000)
})
const location = ref(null)
let toc = markRaw([])
const page = ref('')
const firstRenderDone = ref(false)


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
const locationChange = (epubcifi) => {
    if (epubcifi) {
        const { displayed, href } = rendition.location.start
        const { cfi } = rendition.location.end
        if (href !== 'titlepage.xhtml') {
            const label = getLabel(toc, href)
            page.value = `${displayed.page}/${displayed.total} ${label}`
        }
    }
}
</script>
<style scoped>
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