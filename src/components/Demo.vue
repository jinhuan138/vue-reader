<template>
    <div style='height: 100vh'>
        <VueReader 
            url='/docs/files/啼笑因缘.epub' 
            :getRendition='getRendition' 
            :tocChanged='tocChanged'
            @update:location='locationChange'>
        </VueReader>
    </div>
    <div class='page'>
        {{ page }}
    </div>
</template>
<script setup>
import { ref } from 'vue'

let rendition = null, toc = []
const page = ref('')
const firstRenderDone = ref(false)

const getRendition = val => rendition = val
const tocChanged = val => toc = val

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
    text-align: center;
    z-index: 1;
    color: #000;
}
</style>