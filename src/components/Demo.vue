<template>
    <div style='height: 100vh' ref="container">
        <VueReader :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "https://cdn.jsdelivr.net/npm/medium-zoom@1.0.8/dist/medium-zoom.min.js"
        }' url='/files/alice.epub' :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>
import mediumZoom from 'medium-zoom'
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

const container = ref(null)
let rendition = null
const getRendition = (val) => {
    rendition = val
    rendition.hooks.content.register((contents, view) => {
        console.log('contents')
        const { document } = contents
        const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        console.log(images)
        contents.window.mediumZoom(images, {
            container: container.value,
            template:container.value
        })
    })
} 
</script>