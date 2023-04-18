<template>
    <div style='position: relative'>
        <div style='height: 100vh' v-show="true">
            <VueReader :getRendition="getRendition" url="/files/啼笑因缘.epub">
            </VueReader>
        </div>
        <div class="progress">
            <input type="number" :value="current" :min="0" :max="100" @change="change">%
            <input type="range" :value="current" :min="0" :max="100" :step="1" @change="change">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { VueReader } from '@/modules/index'

const current = ref(0)
let rendition, book, displayed

const getRendition = (val) => {
    rendition = val
    book = rendition.book
    displayed = rendition.display();
    book.ready.then(() => {
        return book.locations.generate(1600);
    }).then(locations => {
        // Wait for book to be rendered to get current page
        displayed.then(function () {
            // Get the current CFI
            var currentLocation = rendition.currentLocation();
            // Get the Percentage (or location) from that CFI
            const currentPage = book.locations.percentageFromCfi(currentLocation.start.cfi);
            current.value = currentPage
        });
        rendition.on('relocated', (location) => {
            const percent = book.locations.percentageFromCfi(location.start.cfi);
            const percentage = Math.floor(percent * 100);
            current.value = percentage
        });
    })
}

const change = (e) => {
    const value = e.target.value
    current.value = value
    var cfi = book.locations.cfiFromPercentage(value / 100);
    rendition.display(cfi);
}
</script>
<style>
.progress {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
    color: #000;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.progress>input[type=range] {
    width: 100%;
}
</style>