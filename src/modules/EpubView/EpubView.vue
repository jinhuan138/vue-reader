<template>
    <div class="reader">
        <div class="viewHolder">
            <div class="view" ref="view" v-show="isLoaded"></div>
            <div v-if="!isLoaded">
                <slot name="loadingView">
                </slot>
            </div>

        </div>
    </div>
</template>
<script setup>
//http://epubjs.org/documentation/0.3/
import { ref, onMounted, onUnmounted, toRefs, watch } from "vue";
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
        //当前页
        type: [Number, String],
    },
    getRendition: {
        type: Function,
    },
    epubInitOptions: {
        type: Object,
        default: () => { }
    },
    epubOptions: {
        type: Object,
        default: () => { }
    },
})


const { url, tocChanged, getRendition, epubInitOptions, epubOptions } = props
const { location } = toRefs(props)

const emit = defineEmits(['update:location'])

const toc = ref([])
const isLoaded = ref(false)
const view = ref(null)
let book = null
let rendition = null;

const initBook = async () => {
    book = new Epub(url, epubInitOptions);
    book.loaded.navigation.then(({ toc: _toc }) => {
        isLoaded.value = true
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
        ...epubOptions
    });
    document.addEventListener("keyup", handleKeyPress);
    registerEvents();
    getRendition && getRendition(rendition)
    if (typeof location.value === 'string' || typeof location.value === 'number') {
        rendition.display(location.value)
    } else if (toc.value.length > 0 && toc.value[0].href) {
        rendition.display(toc.value[0].href)
    } else {
        rendition.display()
    }
}

const registerEvents = () => {
    rendition.on("keyup", handleKeyPress);
    rendition.on('locationChanged', onLocationChange)
};


const handleKeyPress = ({ key }) => {
    if (key === "ArrowDown" || key === "ArrowRight") {
        nextPage();
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
        prevPage();
    }
};

const onLocationChange = loc => {//监听翻页
    const newLocation = loc && loc.start
    if (location.value !== newLocation) {
        emit('update:location', newLocation)
    }
}

watch(location, (val) => {
    // if (typeof location.value === 'string' || typeof location.value === 'number')
    //     rendition.display(val)
})

const nextPage = () => {
    console.log('nextPage')
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
<style scoped>
.reader {
    position: absolute;
    inset: 50px 50px 20px;
}

.viewHolder {
    height: 100%;
    width: 100%;
    position: relative;
}

.view {
    height: 100%;
}
</style>