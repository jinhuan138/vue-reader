<template>
    <div class="container">
        <div class="vueContainer">
            <VueReader :location="location" :url="url" @update:location="locationChange"
                :getRendition="val => rendition = val" :tocChanged="val => toc = val">
            </VueReader>
            <div class="page">
                {{ page }}
            </div>
        </div>
    </div>
</template>
<script setup>
// import { VueReader } from "/lib/index.min.js";
import VueReader from "@/modules/VueReader/VueReader.vue";
import epub from 'epubjs'
import { ref, nextTick } from "vue";

const book = '啼笑因缘'
const url = ref(`/files/${book}.epub`)
const rendition = ref(null)
const location = ref(null)
const toc = ref([])
const page = ref('')
const firstRenderDone = ref(false)

nextTick(() => {
    rendition.value.hooks.content.register((contents, view) => {
        let msg = new SpeechSynthesisUtterance()
        let text = contents.document.body.textContent
        text = text
            .replace(/\s\s/g, "")
            .replace(/\r/g, "")
            .replace(/\n/g, "")
            .replace(/\t/g, "")
            .replace(/\f/g, "");
        msg.text = text;
        msg.voice = window.speechSynthesis.getVoices()[0];
        msg.rate = 1;
        window.speechSynthesis.speak(msg);
        msg.onerror = (err) => {
            console.log(err);
        };
        msg.onend = async (event) => {
            // this.handleAudio();
        };
    })
})

const locationChange = (epubcifi) => {
    //翻页
    const getLabel = (toc, href) => {
        let label = 'n/a';
        toc.some(item => {
            if (item.subitems.length > 0) {
                const subChapter = getLabel(item.subitems, href);
                if (subChapter !== 'n/a') {
                    label = subChapter
                    return true
                }
            } else if (item.href.includes(href)) {
                label = item.label
                return true
            }
        })
        return label;
    }
    if (epubcifi) {
        const { displayed, href } = rendition.value.location.start
        const { cfi } = rendition.value.location.end
        if (href !== 'titlepage.xhtml') {
            const label = getLabel(toc.value, href)
            page.value = `${displayed.page}/${displayed.total} ${label}`
        }
    }
    //存储
    if (!firstRenderDone.value) {
        location.value = localStorage.getItem(book)
        return firstRenderDone.value = true
    }
    localStorage.setItem(book, epubcifi)
}
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

.page {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
}
</style>
  