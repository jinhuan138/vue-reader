<template>
    <div style="height: 100vh">
        <VueReader :epubOptions='{
            allowPopups: true,
                allowScriptedContent: true,
                    script: "../../node_modules/medium-zoom/dist/medium-zoom.min.js"
        }' url="/files/alice.epub" :getRendition="getRendition">
        </VueReader>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
import { nextTick } from "vue";
let rendition = null
const getRendition = val => rendition = val

nextTick(async () => {
    rendition.hooks.content.register(async (contents, view) => {
        const { document } = contents
        const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        contents.window.mediumZoom(images, {
            // background: '#BADA55',
            // scrollOffset: 0,
            // container: 'body',
            // template: "#reader",
            // template: '#zoom-template',
        })
    })
})
</script>