<template>
    <div style='height: 100vh'>
        <VueReader url='/files/啼笑因缘.epub' :location='location' :getRendition='getRendition' :tocChanged="tocChanged"
            @update:location='locationChange'>
            <template #loadingView>
                <div class="loading">
                    加载中...{{ process }}%
                    <div class="outer">
                        <div class="inner" :style="{ width: `${process}%` }"></div>
                    </div>
                </div>
            </template>
        </VueReader>
    </div>
    <div class='page'>
        {{ page }}
    </div>
</template>
<script setup>
import { VueReader } from '@/modules/index'
import { ref, onMounted, onBeforeMount, } from 'vue'

let rendition = null, toc = []
const process = ref(0)
const page = ref('')
const location = ref(null)
const firstRenderDone = ref(false)

const getRendition = val => {
    rendition = val
    const book = rendition.book
    book.on('book:downloadProgress', (percentage) => {
        // this.updateDownloadProgressBar(percentage)
        console.warn(percentage)
    })
}
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
    location.value = epubcifi
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
<style>
.page {
    text-align: center;
    z-index: 1;
    color: #000;
}

.loading {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    color: #ccc;
    text-align: center;
    margin-top: -.5em;
}

.loading .outer {
    height: .6rem;
    width: 80%;
}

.loading .outer .inner {
    animation-duration: 3s;
    transition: width .1s ease;
    border-radius: 100px;
    background-color: #eb5732;
    height: 100%;
}
</style>