<template>
    <div style="height: 100vh">
        <VueReader :location="location" :url="url" @update:location="locationChange" :getRendition="val => rendition = val"
            :tocChanged="val => toc = val">
        </VueReader>
    </div>
</template>
<script setup>
// import { VueReader } from "/lib/index.min.js";
import VueReader from "@/modules/VueReader/VueReader.vue";
import mediumZoom from 'medium-zoom'
import { ref, nextTick, computed, markRaw } from "vue";

const book = 'alice'
const url = ref(`/files/${book}.epub`)
let rendition = markRaw({})
let epubBook = markRaw({})
const location = ref(null)
let toc = markRaw([])
const page = ref('')
const firstRenderDone = ref(false)

//朗读
const voice = (text, rate = 1) => {
    const msg = new SpeechSynthesisUtterance()
    msg.text = text;
    sg.voice = window.speechSynthesis.getVoices()[0];
    msg.rate = rate
    window.speechSynthesis.speak(msg);
    msg.onerror = (err) => {
        console.log(err);
    };
    msg.onend = async (event) => {
        rendition.next()
    };
}

nextTick(() => {
    rendition.hooks.content.register((contents, view) => {
        // let msg = new SpeechSynthesisUtterance()
        // let text = contents.document.body.textContent
        // text = text
        //     .replace(/\s\s/g, "")
        //     .replace(/\r/g, "")
        //     .replace(/\n/g, "")
        //     .replace(/\t/g, "")
        //     .replace(/\f/g, "");
        //图片放大
        // console.log(contents.document.querySelectorAll('img'))
        mediumZoom(contents.document.querySelectorAll('img'))
    })
})

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
const locationChange = (epubcifi) => {
    //翻页
    if (epubcifi) {
        const { displayed, href } = rendition.location.start
        const { cfi } = rendition.location.end
        if (href !== 'titlepage.xhtml') {
            const label = getLabel(toc, href)
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
  