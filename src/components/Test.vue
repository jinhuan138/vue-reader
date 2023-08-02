<template>
    <div style='height: 100vh'>
        <VueReader ref="viewer" :epubOptions='{
            allowScriptedContent: true,
            script: "/node_modules/medium-zoom/dist/medium-zoom.min.js"
        }' url='/files/alice.epub' :getRendition="getRendition">
        </VueReader>
    </div>
    <!-- <div>
        <img src="/vite.svg" alt="">
    </div> -->
</template>
<script setup>
//https://www.npmjs.com/package/medium-zoom
//https://kingdido999.github.io/zooming/docs/#/
import { onBeforeUnmount, ref, onMounted } from 'vue'
import { VueReader } from "@/modules/index"
import InlineView from 'epubjs/lib/managers/views/inline'
// import Zooming from 'zooming'
// import mediumZoom from 'medium-zoom'

let zoom = null
const closeZoom = () => {
    if (zoom && zoom.getZoomedImage()) zoom.close()
}
const getRendition = (rendition) => {
    rendition.themes.default({
        'img': {
            'cursor': 'zoom-in'
        },
        'image': {
            'cursor': 'zoom-in'
        }
    });
    rendition.hooks.content.register((contents, view) => {
        const contentsDom = contents.document
        const { mediumZoom } = contents.window
        const images = [...contentsDom.querySelectorAll('img'), ...contentsDom.querySelectorAll('image')]
        // const zooming = new Zooming({
        //     // customSize: { width: 800, height: 400 }
        // })
        // images.forEach(img=>{
        //     zooming.listen(img)
        // })
        zoom = mediumZoom(images, {
            background: 'rgba(0, 0, 0, 0.97)',
            container: document.body
        })
        // contentsDom.addEventListener('click', async (e) => {
        //     if (zoom.getImages().includes(e.target)) {
        //         if (zoom.getZoomedImage()) await zoom.close()
        //         e.target.style.zIndex = 5
        //         zoom.update({ background: '#000', container: document.body })
        //         zoom.open({ target: e.target })
        //     } else {
        //         zoom.close()
        //     }
        // })
        // document.addEventListener('click', closeZoom)
    })
}
const viewer = ref(null)
onMounted(() => {
    const el = viewer.value.$el
    setTimeout(() => {
        const iframe = el.querySelector('iframe')
        iframe.style.width = '100vw'
    },500)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', closeZoom)
})
</script>