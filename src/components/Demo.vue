<template>
    <div style='height: 100vh'>
        <VueReader :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "/node_modules/medium-zoom/dist/medium-zoom.js"
        }' url='/files/啼笑因缘.epub' :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>
import { VueReader } from '@/modules/index'
import { onBeforeUnmount } from 'vue'
import mediumZoom from 'medium-zoom'

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
                // e.target.style.zIndex = 5
                zoom.open({ target: e.target })
            } else {
                zoom.close()
            }
        })
        document.addEventListener('click', closeZoom)
    })
    rendition.on("relocated", function (location) {
        console.log(location);
        //   var next = book.package.metadata.direction === "rtl" ?  document.getElementById("prev") : document.getElementById("next");
        //   var prev = book.package.metadata.direction === "rtl" ?  document.getElementById("next") : document.getElementById("prev");

        //   if (location.atEnd) {
        //     next.style.visibility = "hidden";
        //   } else {
        //     next.style.visibility = "visible";
        //   }

        //   if (location.atStart) {
        //     prev.style.visibility = "hidden";
        //   } else {
        //     prev.style.visibility = "visible";
        //   }
    });
}
onBeforeUnmount(() => {
    document.removeEventListener('click', closeZoom)
})
</script>