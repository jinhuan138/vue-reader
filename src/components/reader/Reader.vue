<template>
    <el-container direction="vertical">
        <titlebar :title="title">

            <el-button-group>
                <el-button size="small" :icon="Back" circle @click="onBackBtn" />
                <el-button size="small" :icon="Grid" circle @click="onLibraryBtn" />
            </el-button-group>

            <toc-menu :toc="bookInfo.toc" :theme="theme" @node-click="onNodeClick"></toc-menu>

            <theme-menu @theme-change="applytheme" @flow-change="applyflow" @style-change="updateStyle" />

        </titlebar>
        <el-main class="container">
            <EpubView :url="url" @update:location="locationChange" :getRendition="getRendition" :tocChanged="tocChanged"
                :title="page">
                <template #loadingView>
                    <el-progress :percentage="loadProcess" />
                </template>
            </EpubView>
        </el-main>
        <el-footer height="45">
            <el-slider v-model="sliderValue" :step="0.01" :format-tooltip="lableFromPercentage"
                @change="onSliderValueChange"></el-slider>
        </el-footer>
    </el-container>
</template>
<script setup>
//https://github.com/code-farmer-i/vue-markdown-editor.git
//https://github.com/hepengwei/visualization-collection
import { Back, Grid } from '@element-plus/icons-vue'
import { EpubView } from '@/modules/index'
import titlebar from './Titlebar.vue'
import TocMenu from './menu/TocMenu.vue';
import ThemeMenu from './menu/ThemeMenu.vue'
import { getInfo } from "./utils/dbUtilis";
import { dark, light, tan } from './utils/themes.js'
import { ref, computed, onMounted } from "vue";

const props = defineProps({
    book: {
        default: '啼笑因缘.epub'
    }
})
const title = computed(() => props.book.replace('.epub', ''))
const url = computed(() => {
    return `/books/${props.book}`
})
const bookInfo = ref({})
let rendition = null, flattenedToc = null, processToc = []

const getRendition = (val) => {
    rendition = val
    const book = rendition.book
    const displayed = rendition.display();
    book.ready.then(() => {
        return book.locations.generate(1600);
    }).then(async locations => {
        rendition.ready = true;
        await getInfo(props.book, book, (info) => {
            bookInfo.value = info
            console.log('info', info)
            flattenedToc = (function flatten(items) {
                return [].concat(...items.map(item => [item].concat(...flatten(item.children))));
            })(info.toc);
            flattenedToc.sort((a, b) => {
                return a.percentage - b.percentage;
            })
        })
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
        rendition.themes.registerRules('dark', dark);
        rendition.themes.registerRules('tan', tan);
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
const lableFromPercentage = (percent) => {
    let toc = tocFromPercentage(percent)
    if (toc) return toc.label;
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
//header
const theme = ref('default')

const onBackBtn = () => {

}
const emit = defineEmits(['update:showReader'])

const onLibraryBtn = () => {
    emit('update:showReader', false)
}

const onNodeClick = (item) => {
    rendition.display(item.cfi || item.href);
}
//theme
const  styleRules =ref({})
const applytheme = (theme) => {
    rendition.themes.select(theme);
}
const applyflow = (flow) => {
    if (!rendition.ready) return;
    rendition.flow(flow);
}
const updateStyle = () => {
    //    styleRules = rules;
    applyStyle();
    refreshRendition();
}
const applyStyle = () => {
    if (!rendition.ready) return;
    rendition.getContents().forEach((content) => {
        content.addStylesheetRules(styleRules.value);
    });
}
</script>
  
<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}

.el-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;

    .el-main {
        width: 100%;
        height: 100%;
        padding: 0px;
    }
}
</style>
  