<template>
    <div class="reader">
        <div class="viewHolder">
            <div class="view" ref="view"></div>
        </div>
    </div>
</template>
<script setup>
//http://epubjs.org/documentation/0.3/
import { ref, onMounted, onUnmounted } from "vue";
import Epub from "epubjs/lib/index";

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    tocChanged: {
        type: Function,
    },
    location: {
        type: [Number, String],
    }
})
const toc = ref([])
const isLoaded = ref(false)
const { url, tocChanged, location } = props

const view = ref(null)
let book = null
let rendition = null;
let bookLocation = location

const initBook = async () => {
    book = new Epub(url, {});
    book.loaded.navigation.then(({ toc: _toc }) => {
        toc.value = _toc
        tocChanged && tocChanged(_toc)
    });
    initReader()
};

const initReader = () => {
    rendition = book.renderTo(view.value, {
        allowScriptedContent: false,
        contained: true,
        width: '100%',
        height: '100%',
    });
    document.addEventListener("keyup", handleKeyPress);
    registerEvents();
    if (typeof location === 'string' || typeof location === 'number') {
        rendition.display(location)
    } else if (toc.length > 0 && toc[0].href) {
        rendition.display(toc[0].href)
    } else {
        rendition.display()
    }
}

const registerEvents = () => {
    rendition.on("keyup", handleKeyPress);
};


const handleKeyPress = ({ key }) => {
    if (key === "ArrowDown" || key === "ArrowRight") {
        nextPage();
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
        prevPage();
    }
};


const nextPage = () => {
    rendition.next();
};

const prevPage = () => {
    rendition.prev();
};

const setLocation = (href) => {
    rendition.display(href);
};

onMounted(() => {
    initBook()
})

onUnmounted(() => {
    book.destroy()
    document.removeEventListener("keyup", handleKeyPress);
});
defineExpose({
    nextPage, prevPage, setLocation
})

</script>
<style>
.reader {
    position: absolute;
    inset: 50px 50px 20px;
}

.viewHolder {
    height: 100%;
    width: 100%;
    /* overflow: hidden; */
    position: relative;
}

.view {
    height: 100%;
}
</style>