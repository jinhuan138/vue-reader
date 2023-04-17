<template>
    <div style='height: 100vh'>
        <VueReader :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "https://cdn.jsdelivr.net/npm/medium-zoom@1.0.8/dist/medium-zoom.min.js"
        }'
            url='/docs/files/alice.epub' :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>
let rendition = null
const getRendition = (val) => {
    rendition = val
    rendition.hooks.content.register((contents, view) => {
        const { document } = contents
        const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        contents.window.mediumZoom(images)
    })
} 
</script>