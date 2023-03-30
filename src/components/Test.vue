<template>
    <div class="container">
        <div class="vueContainer">
            <VueReader :location="location" url="/files/alice.epub" @update:location="locationChange">
            </VueReader>
        </div>
    </div>
</template>
<script setup>
// import { VueReader } from "../lib/index.min.js";
import VueReader from "./modules/VueReader/VueReader.vue";
import Library from '@/components/Library.vue'
import { ref, onMounted, watch, onUnmounted } from "vue";

const toc = ref(null)
const page = ref('')
const url = ref("/files/啼笑因缘.epub")

const rendition = ref(null)
const selections = ref([])
const setRenderSelection = (cfiRange, contents) => {
    selections.value.push({
        text: rendition.value.getRange(cfiRange).toString(),
        cfiRange
    })
    rendition.value.annotations.add(
        'highlight',
        cfiRange,
        {},
        null,
        'hl',
        { fill: 'red', 'fill-opacity': '0.5', 'mix-blend-mode': 'multiply' }
    )
    contents.window.getSelection().removeAllRanges()
}
const getRendition = (val) => {
    rendition.value = val
    rendition.value.themes.default({
        '::selection': {
            background: 'orange'
        }
    })
    if (rendition.value) {
        rendition.value.on('selected', setRenderSelection)
    }
}
const remove = (cfiRange, index) => {
    rendition.value.annotations.remove(cfiRange, 'highlight')
    selections.value = selections.value.filter((item, j) => j !== index)
}
onUnmounted(() => {
    rendition.value.off('selected', setRenderSelection)
})
const location = ref(null)
const firstRenderDone = ref(false)
</script>
  
<style scoped>
.container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
    overflow: hidden;
}

.vueContainer {
    font-size: 16px;
    position: absolute;
    top: 0px;
    left: 0rem;
    right: 0rem;
    bottom: 0rem;
}

.demo {
    width: 100px;
    height: 100px;
    background-color: skyblue;
}

.title {
    text-align: center;
    color: skyblue;
}

.loadingView {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    color: skyblue;
    text-align: center;
    margin-top: -.5em;
}

.page {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
}

.size {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
}

.selection {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 1;
    background-color: white;
    color: #000;
}
</style>
  