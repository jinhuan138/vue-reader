<template>
    <div style='height: 100vh'>
        <VueReader :epubOptions='{
            width: "100%"
        }' url='/files/alice.epub' :getRendition="getRendition">
        </VueReader>
    </div>
</template>
<script setup>
import { onBeforeUnmount } from 'vue'
import { VueReader } from "@/modules/index"
import InlineView from 'epubjs/lib/managers/views/inline'
import mediumZoom from 'medium-zoom'

let zoom = null
const closeZoom = () => {
    if (zoom && zoom.getZoomedImage()) zoom.close()
}

const getRendition = (rendition) => {
    rendition.hooks.content.register((contents, view) => {
        const contentsDom = contents.document
        const images = [...contentsDom.querySelectorAll('img'), ...contentsDom.querySelectorAll('image')]
        images.forEach((img, index) => {
            const boxImg = img.cloneNode(true);
            const box = document.createElement('a')
            box.href='#'
            box.id='image' + index
            box.appendChild(boxImg)
            contentsDom.body.appendChild(box)
            const link = document.createElement('a')
            link.href = '#image' + index
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
        })
        //     zoom = mediumZoom(images, {
        //         background: 'rgba(247, 249, 250, 0.97)'
        //     })
        //     contentsDom.addEventListener('click',async (e) => {
        //         if (zoom.getImages().includes(e.target)) {
        //             if (zoom.getZoomedImage()) await zoom.close()
        //             e.target.style.zIndex = 5
        //             zoom.open({ target: e.target })
        //         } else {
        //             zoom.close()
        //         }
        //     })
        //     document.addEventListener('click', closeZoom)
        // const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        // mediumZoom(images, {
        //     background: 'rgba(247, 249, 250, 0.97)'
        // })
    })
}
onBeforeUnmount(() => {
    document.removeEventListener('click', closeZoom)
})
</script>