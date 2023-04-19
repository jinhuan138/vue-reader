<template>
    <div>
        <div style='height: 100vh'>
            <VueReader :epubOptions='{
                allowPopups: true,
                allowScriptedContent: true,
                script: "/node_modules/medium-zoom/dist/medium-zoom.js"
            }' url='/files/alice.epub' :getRendition='getRendition'>
            </VueReader>
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "@/modules/index"
import mediumZoom from 'medium-zoom'

let rendition = null
const getRendition = (val) => {
    rendition = val
    rendition.hooks.content.register((contents, view) => {
        const images = [...contents.document.querySelectorAll('img'), ...contents.document.querySelectorAll('image')]
        const zoom = mediumZoom(images, {
            background: 'rgba(247, 249, 250, 0.97)'
        })
        contents.document.addEventListener('click', (e) => {
            e.target.style.zIndex = 5
            zoom.open({ target: e.target })
        })
    })
}
</script>
<style>
.paper-container {
    width: 100%;
    height: calc(100% - 64px);
    margin: 0 auto;
}

.paper-header {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 16px;
}

.paper-main {
    flex: 1;
    height: 100%;
}

.paper-close {
    width: 24px;
    cursor: pointer;
    fill: #637282;
}

.paper-wrapper {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}
</style>
