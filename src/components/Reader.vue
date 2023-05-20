<template>
    <div style="height: 90vh">
        <VueReader :url="url" @update:location="locationChange" :getRendition="getRendition" :tocChanged="tocChanged">
            <template #loadingView>
                <el-progress :percentage="loadProcess" />
            </template>
        </VueReader>
        <div class="page">
            <!-- {{ page }} -->
            <el-slider v-model="sliderValue" :step="0.01" :format-tooltip="lableFromPercentage"
                @change="onSliderValueChange"></el-slider>
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
import { db } from "../utils/db";
import { ref, computed, onMounted } from "vue";
const props = defineProps({
    book: {
        default: '啼笑因缘'
    }
})
const url = computed(() => {
    // if (id) {
    //     //indexDB导入
    // } else if (name) {
    //     //url导入
    //     return `/books/${name}`
    // } else {
    //     return `/files/${defaultBook}.epub`
    // }
    return `/books/${props.book}`
})
const image2Base64 = (url) => new Promise((resolve, reject) => {
    if (!url) return resolve('');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const data = canvas.toDataURL();
        resolve(data);
    };
    img.onerror = () => {
        reject('');
    };
})

let rendition = null, flattenedToc = null
const getRendition = (val) => {
    rendition = val
    const book = rendition.book
    const displayed = rendition.display();
    book.ready.then(() => {
        const processToc = parshToc(book)
        console.log(processToc)
        return book.locations.generate(1600);
    }).then(locations => {
        displayed.then(() => {
            var currentLocation = rendition.currentLocation();
            const currentPage = book.locations.percentageFromCfi(currentLocation.start.cfi);
            sliderValue.value = currentPage
        });
        rendition.on('relocated', (location) => {
            const percent = book.locations.percentageFromCfi(location.start.cfi);
            const percentage = Math.floor(percent * 100);
            sliderValue.value = percentage
        });
    })
}
// const location = ref(2)
const toc = ref([])
const page = ref('')
const firstRenderDone = ref(false)
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
            const label = getLabel(toc.value, href)
            page.value = `${displayed.page}/${displayed.total} ${label}`
        }
    }
    //存储
    // if (!firstRenderDone.value) {
    //     location.value = localStorage.getItem(book)
    //     return firstRenderDone.value = true
    // }
    // localStorage.setItem(book, epubcifi)
}
const tocChanged = (_toc) => {
    toc.value = _toc
}

//阅读进度
const sliderValue = ref(0)
const parshToc = (book) => {
    const { toc } = book.navigation;
    const { spine } = book;
    const validateHref = href => {
        if (href.startsWith('..')) {
            href = href.substring(2);
        }
        if (href.startsWith('/')) {
            href = href.substring(1);
        }
        return href;
    };
    const getSpineComponent = href => {
        return href.split('#')[0];
    };
    const getPositonComponent = href => {
        return href.split('#')[1];
    };
    const tocTree = [];
    const createTree = (toc, parrent) => {
        for (let i = 0; i < toc.length; i += 1) {
            const href = validateHref(toc[i].href);
            const spineComponent = getSpineComponent(href);
            const positonComponent = getPositonComponent(href);
            const spineItem = spine.get(spineComponent);
            spineItem.load(book.load.bind(book)).then(() => {
                const el = spineItem.document.getElementById(positonComponent);
                const cfi = spineItem.cfiFromElement(el);
                const percentage = book.locations.percentageFromCfi(cfi);
                parrent[i] = {
                    label: toc[i].label.trim(),
                    children: [],
                    href,
                    cfi,
                    percentage,
                };
                if (toc[i].subitems) {
                    createTree(toc[i].subitems, parrent[i].children);
                }
            });
        }
    };
    createTree(toc, tocTree);
    return tocTree;
}
const lableFromPercentage = (percent) => {
    let toc = tocFromPercentage(percent)
    // console.log(toc.label)
    // if (toc) return toc.label;
    return '';
}
const tocFromPercentage = (percent) => {
    if (!flattenedToc) return {};
    percent /= 100;
    for (let i = 0; i < flattenedToc.length; i += 1) {
        if (flattenedToc[i].percentage > percent) {
            return flattenedToc[i - 1];
        }
    }
    return null;
}
const onSliderValueChange = (val) => {
    let cfi = rendition.book.locations.cfiFromPercentage(val / 100);
    rendition.display(cfi);
}
//加载进度
const loadProcess = ref(0)
const trackAllDownloads = (onProgress) => {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
                onProgress(event.loaded / event.total);
            }
        }, false);
        open.apply(this, arguments);
    };
}
// 监听所有下载进度并显示进度条
trackAllDownloads((_progress) => {
    loadProcess.value = Math.round(_progress * 100)
});

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

/* .loading {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    color: #ccc;
    text-align: center;
    margin-top: -.5em;
}

.loading .outer {
    height: .6rem;
    width: 80%;
}

.loading .outer .inner {
    animation-duration: 3s;
    transition: width .1s ease;
    border-radius: 100px;
    background-color: #eb5732;
    height: 100%;
} */
</style>
  