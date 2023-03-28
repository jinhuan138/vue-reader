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
import { ref, onMounted, onUnmounted, toRefs, watch, nextTick, computed } from "vue-demi";
import Epub from "epubjs/dist/epub";
// import Vibrant from 'node-vibrant/dist/vibrant'

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

const { tocChanged, getRendition, epubInitOptions, epubOptions } = props
const { url, location } = toRefs(props)

const emit = defineEmits(['update:location'])

const toc = ref([])
const isLoaded = ref(false)
const view = ref(null)
let book = null
let rendition = null;
// let bookDetail = {}

const initBook = async () => {
    if (book) book.destroy()
    book = new Epub(url.value, epubInitOptions);
    book.ready.then(() => {
        book.loaded.navigation.then(({ toc: _toc }) => {
            isLoaded.value = true
            toc.value = _toc
            tocChanged && tocChanged(_toc)
        });
        // book.loaded.metadata.then(async (metadata) => {
        //     const cover = await book.coverUrl()
        //     const palette = await Vibrant.from(cover).getPalette()
        //     const { title, identifier, creator, publisher, language, pubdate, description, modified_date } = metadata
        //     bookDetail = {
        //         identifier,//id
        //         title,//标题
        //         creator,//作者
        //         publisher,//出版社
        //         language,//语言
        //         pubdate,//出版日期
        //         modified_date,//修改日期
        //         description,//介绍
        //         cover,//封面
        //         bgColorFromCover: palette.DarkVibrant.hex,//主题色
        //     }
        //     console.log(bookDetail)
        // });
        // ;
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

watch(location, (val, old) => {
    if (val === old) return
    if (typeof val === 'string' || typeof val === 'number') {
        rendition.display(val)
    }
}, {
    immediate: true
})
watch(url, () => {
    initBook()
})

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