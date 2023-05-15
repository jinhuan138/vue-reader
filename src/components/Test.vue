<template>
    <div style="height: 100vh">
        <VueReader id="readerRef" :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "/node_modules/medium-zoom/dist/medium-zoom.min.js"
        }' :location="location" :url="url" :getRendition="getRendition" :tocChanged="val => toc = val">
        </VueReader>
    </div>
</template>
<script setup>
// import { VueReader } from "/lib/index.min.js";
import VueReader from "@/modules/index";
import mediumZoom from 'medium-zoom'
import { ref, nextTick, computed } from "vue";
const readerRef = ref(null)
const book = 'alice' //alice,啼笑因缘
const url = ref(`/files/${book}.epub`)
let rendition = null
const location = ref(null)
const getRendition = val => rendition = val
const toc = ref([])
const page = ref('')

nextTick(async () => {
    // const locations = await rendition.book.locations.generate()
    // console.log('locations', locations)
    const { book } = rendition
    // rendition.on('relocated', function (locations) {

    //     let progress = book.locations.percentageFromCfi(locations.start.cfi);
    //     console.log('Progress:', progress); // The % of how far along in the book you are
    //     console.log('Current Page:', book.locations.locationFromCfi(locations.start.cfi))
    //     console.log('Total Pages:', book.locations.total);
    // });
    book.ready.then((book) => {
        console.log(book)
        // return book.locations.generate();
    }).then(locations => {
        console.log("Total Pages?: ", locations.length);
    });
    rendition.hooks.content.register(async (contents, view) => {
        console.log(rendition.currentLocation())
        // console.log(toc.value)
        const { document } = contents

        const images = [...document.querySelectorAll('img'), ...document.querySelectorAll('image')]
        // console.log(images)
        // console.log(readerRef.value)
        contents.window.mediumZoom(images, {
            // // background: '#BADA55',
            // scrollOffset: 0,
            // container: 'body',
            // template: "#reader",
            // // template: '#zoom-template',
        })
    })
})

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
  