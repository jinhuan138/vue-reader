<template>
    <div style='height: 50vh'>
        <VueReader url='/files/alice.epub'>
        </VueReader>
    </div>
    <div style='height: 50vh'>
        <VueReader url='/files/alice.epub'>
        </VueReader>
    </div>
</template>
<script setup>
import { VueReader } from '@/modules/index'
import { onBeforeUnmount } from 'vue'
import mediumZoom from "medium-zoom"

let zoom = null
const closeZoom = () => {
    if (zoom && zoom.getZoomedImage()) zoom.close()
}
const getRendition = (rendition) => {
    rendition.hooks.content.register((contents, view) => {
        const contentsDom = contents.document
        const images = [...contentsDom.querySelectorAll('img'), ...contentsDom.querySelectorAll('image')]
        zoom = mediumZoom(images, {
            background: 'rgba(247, 249, 250, 0.97)'
        })
        contentsDom.addEventListener('click', async (e) => {
            if (zoom.getImages().includes(e.target)) {
                if (zoom.getZoomedImage()) await zoom.close()
                e.target.style.zIndex = 5
                zoom.open({ target: e.target })
            } else {
                zoom.close()
            }
        })
        document.addEventListener('click', closeZoom)
    })
}
onBeforeUnmount(() => {
    document.removeEventListener('click', closeZoom)
})
</script>
<style scoped>
.page {
    text-align: center;
    z-index: 1;
    color: #000;
}
</style>