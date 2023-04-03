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
<script setup lang="ts">
//http://epubjs.org/documentation/0.3/
import { ref, onMounted, onUnmounted, toRefs, watch ,toRaw} from "vue";
import ePub, { Book, Rendition } from 'epubjs';
import { clickListener, swipListener, wheelListener, keyListener } from '../utils/listener/listener';
// import Vibrant from 'node-vibrant/dist/vibrant'

type Props = {
    url: {
        type: Book['url'],
        required: true
    },
    location?: {
        //当前页
        type: Rendition['location'],
    },
    tocChanged?: {
        type: Function,
        require: false
    },
    getRendition?: {
        type: Function,
    },
    epubInitOptions?: {
        type: Book['settings'],
    },
    epubOptions?: {
        type: Rendition['settings'],
    }
}
const props = withDefaults(defineProps<Props>(), {
    epubInitOptions: {},
    epubOptions: {}
})

const { tocChanged, getRendition, epubInitOptions, epubOptions } = props
const { url, location } = toRefs(props)

const emit = defineEmits(['update:location'])

const toc = ref<[Book['pageList']] | []>([])
const isLoaded = ref(false)
const view = ref<null | HTMLDivElement>(null)
let book: null | Book = null
let rendition: null | Rendition = null;
// let bookDetail = {}

const initBook = async () => {
    if (book) book.destroy()
    book = new ePub(url.value, epubInitOptions);
    book!.ready.then(() => {
        book!.loaded.navigation.then(({ toc: _toc }) => {
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
    rendition = book!.renderTo(view.value, {
        contained: true,
        width: '100%',
        height: '100%',
        ...epubOptions
    });
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

const flipPage = (direction: string) => {
    if (direction === 'next') nextPage();
    else if (direction === 'prev') prevPage();
}

const registerEvents = () => {
    rendition!.on('rendered', (e: Event, iframe: HTMLIFrameElement) => {
        iframe?.iframe?.contentWindow.focus()
        clickListener(iframe.document, rendition, flipPage);
        // selectListener(iframe.document, rendition, toggleBuble);
        swipListener(iframe.document, flipPage);
        wheelListener(iframe.document, flipPage);
        keyListener(iframe.document, flipPage);
    });
    rendition!.on('locationChanged', onLocationChange)
};


const onLocationChange = (loc) => {//监听翻页
    const newLocation = loc && loc.start
    if (location.value !== newLocation) {
        emit('update:location', newLocation)
    }
}

const debounce = (func: Function, wait = 500) => {
    let timeout: null;
    return function executedFunction(...args: any) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
watch(location, debounce((val: string | number, old: string | number) => {
    if (val === old) return
    if (typeof val === 'string' || typeof val === 'number') {
        rendition?.display(val)
    }
}), {
    immediate: true
})
watch(url, () => {
    initBook()
})

const nextPage = () => {
    rendition?.next();
};

const prevPage = () => {
    rendition?.prev();
};

const setLocation = (href: string | number) => {
    rendition!.display(href);
};

onMounted(() => {
    initBook()
})

onUnmounted(() => {
    book?.destroy()
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