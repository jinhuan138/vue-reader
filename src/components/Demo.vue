<template>
    <div style='position: relative' :style='{ height: url ? "100vh" : "50px" }'>
        <div style='height: 100vh' v-if="url">
            <VueReader :url='url' :title='title' :getRendition='getRendition' @update:location='locationChange' />
        </div>
        <input type="file" :multiple="false" accept=".epub" @change="onchange" class="input">
    </div>
</template>
<script setup>
import { ref } from 'vue'
import VueReader from "vue-reader"
let isAudioOn = false, text = '', rendition
let isReading = ref(false)

const getRendition = val => {
    rendition = val
    rendition.hooks.content.register((contents) => {
        let textContent = contents.document.body.textContent
        console.log(textContent)
    });
}
const url = ref(null), title = ref('')

const onchange = (e) => {
    const file = e.target.files[0];
    const { name } = file
    title.value = name.replace('.epub', '')
    if (window.FileReader) {
        var reader = new FileReader();
        reader.onloadend = e => url.value = reader.result
        reader.readAsArrayBuffer(file);
    }
}
const locationChange = () => {
    const range = rendition.getRange(rendition.currentLocation().start.cfi);
    const endRange = rendition.getRange(rendition.currentLocation().end.cfi);
    range.setEnd(endRange.startContainer, endRange.startOffset);
    // console.log(range.toString())
    // text = range.toString().replace(/\s\s/g, '')
    //     .replace(/\r/g, '')
    //     .replace(/\n/g, '')
    //     .replace(/\t/g, '')
    //     .replace(/\f/g, '')
}
</script>
<style>
.input {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
}
</style>