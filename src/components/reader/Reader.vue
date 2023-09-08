<template>
    <el-container direction="vertical">
        <titlebar :title="title">

            <el-button-group>
                <el-button size="small" :icon="Back" circle @click="onBackBtn" />
                <el-button size="small" :icon="Grid" circle @click="onLibraryBtn" />
            </el-button-group>

            <toc-menu :toc="currentBook.toc" @node-click="onNodeClick"></toc-menu>

            <!-- <bookmark-menu :bookmarks="currentBook.bookmarks" @node-click="onNodeClick" @add-bookmark="addBookmark"
                @remove-bookmark="removeBookmark" /> -->

            <search-menu :search-result="searchResult" @node-click="onNodeClick" @search="search" />

            <theme-menu @theme-change="applytheme" @flow-change="applyflow" @style-change="updateStyle" />

        </titlebar>

        <el-main class="container">
            <EpubView id="reader" :url="url" :getRendition="getRendition" :title="page" v-loading="!isReady" :epubOptions="{
                allowPopups: true,
                allowScriptedContent: true,
            }" @update:location="locationChange">
                <template #loadingView>
                    <el-progress :percentage="loadProcess" />
                </template>
            </EpubView>
        </el-main>

        <el-footer height="45">
            <el-slider v-model="sliderValue" :step="0.01" :format-tooltip="lableFromPercentage"
                @change="onSliderValueChange"></el-slider>
        </el-footer>

        <buble-menu ref="bubleMenu" @highlight-btn-click="highlightSelection" />
    </el-container>
</template>
<script setup>
//https://github.com/code-farmer-i/vue-markdown-editor.git
//https://github.com/hepengwei/visualization-collection
import { db } from "./utils/db"
import { Back, Grid } from '@element-plus/icons-vue'
import { EpubView } from '@/modules/index'
import titlebar from './Titlebar.vue'
import TocMenu from './menu/TocMenu.vue';
import BookmarkMenu from './menu/BookmarkMenu.vue';
import SearchMenu from './menu/SearchMenu.vue'
import ThemeMenu from './menu/ThemeMenu.vue'
import BubleMenu from './menu/BubleMenu.vue';
import selectListener from '../../modules/utils/listener/select'
import { getInfo } from "./utils/dbUtilis";
import { dark, tan } from './utils/themes'
import { useReaderStore } from './utils/stores'
import { ref, computed, onMounted } from "vue";

const reader = useReaderStore()

const props = defineProps({
    bookInfo: {
        type: [Object, Number,ArrayBuffer]
    }
})
const isReady = ref(false)
const currentBook = ref({})
const title = ref('')
const url = computed(() => {
    if (!props.bookInfo.url) {
        // const info = await db.books.get(props.bookInfo);
        return props.bookInfo
    } else {
        return `${import.meta.env.BASE_URL}books/${props.bookInfo.url}`
    }
})
let rendition = null, flattenedToc = null

const getRendition = (val) => {
    rendition = val
    const book = rendition.book
    // const displayed = rendition.display();
    rendition.on('rendered', (e, iframe) => {
        selectListener(iframe.document, rendition, toggleBuble);
    });
    rendition.on('relocated', (location) => {
        // info.lastCfi = location.start.cfi;
        history.value.push(location.start.cfi);
        progress.value = book.locations.percentageFromCfi(location.start.cfi);
        // sliderValue.value = Math.floor(progress.value * 10000) / 100;
    });
    rendition.hooks.content.register(applyStyle)

    book.ready
        .then(() => {
            const meta = book.package.metadata;
            console.log(book.package.metadata)
            title.value = meta.title;
            return book.locations.generate();
        })
        .then(async locations => {
            // rendition.display(this.info.lastCfi || 1);
            rendition.themes.registerRules('dark', dark);
            rendition.themes.registerRules('tan', tan);
            rendition.ready = true;
            //applytheme
            const { theme, flow, } = reader
            applytheme(theme)
            applyflow(flow)
            await getInfo(url.value, book, (info) => {
                currentBook.value = info
                flattenedToc = (function flatten(items) {
                    return [].concat(...items.map(item => [item].concat(...flatten(item.children))));
                })(info.toc);
                flattenedToc.sort((a, b) => {
                    return a.percentage - b.percentage;
                })
            })
        })
        .then(() => {
            isReady.value = true;
            // this.info.highlights.forEach(cfiRange => {
            //     rendition.annotations.highlight(cfiRange);
            // });
        })
        .then(() => {
            isReady.value = true;
        });
}
const toc = ref([])
const page = ref('')
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
//info

// const info = ref(props.bookInfo)
onMounted(() => {
    // info.value.lastOpen = new Date().getTime();
    // reader.setBook(info.id, info)
})

//阅读进度
const sliderValue = ref(0)
const progress = ref(0)
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
const history = ref([])
const onBackBtn = () => {
    // remove current location
    history.value.pop();
    let lastLocation = history.value.pop();
    if (lastLocation) {
        rendition.display(lastLocation);
    } else {
        // go to homepage
        emit('update:showReader', false)
    }
}
const emit = defineEmits(['update:showReader', 'theme-change'])

const onLibraryBtn = () => {
    emit('update:showReader', false)
}

const onNodeClick = (item) => {
    console.log(item.cfi, item.href)
    rendition.display(item.cfi || item.href);
}
//theme
const styleRules = ref({})
const applytheme = (val) => {
    // theme.value = val;
    rendition.themes.select(val);
    reader.theme = val
    refreshRendition()
    emit('theme-change', val);
}
const applyflow = (flow) => {
    if (!rendition.ready) return;
    rendition.flow(flow);
}
const updateStyle = (rules) => {
    styleRules.value = rules;
    applyStyle();
    refreshRendition();
}
const refreshRendition = () => {
    // re-render to apply theme properly
    if (rendition && rendition.manager) {
        rendition.start();
    }
}
const applyStyle = () => {
    if (!rendition) return;
    rendition.getContents().forEach((content) => {
        content.addStylesheetRules(styleRules.value);
    });
}
//search
const searchResult = ref([])
const search = (text) => {
    const book = rendition.book
    return Promise.all(
        book.spine.spineItems.map(item =>
            item
                .load(book.load.bind(book))
                .then(item.find.bind(item, text))
                .finally(item.unload.bind(item))
        )
    )
        .then(results => results.flat())
        .then(results => {
            searchResult.value = results.map(result => {
                result.label = result.excerpt;
                return result;
            });
        }).then(() => {
            // this.$remote.getCurrentWebContents().findInPage(text);
        })
}
//highlight
const bubleMenu = ref(null)
const toggleBuble = (event, react, text, cfiRange) => {
    if (event === 'cleared') {
        // hide buble
        // this.buble.hide();
        bubleMenu.value.hide()
        return;
    }
    console.log(bubleMenu.value)
    bubleMenu.value.setProps(react, text, cfiRange);
    bubleMenu.value.isBubleVisible = true;
    // this.buble.setProps(react, text, cfiRange);
    // this.isBubleVisible = true;
}
const highlightSelection = (cfiRange) => {
    rendition.annotations.highlight(cfiRange);
    // this.info.highlights.push(cfiRange);
    // this.$db.set(this.info.id, this.info);
}
//bookmark
const addBookmark = () => {
    /**
     * prefred structure of bookmark object
     *  let bookmark = {
     *  title:'',// title of page of topic where bookmark is placed
     *  cfi:'', // cfi of location
     *  href:'' // href of location
     * }
     */

    const { location } = this.rendition;
    const { href, cfi, percentage } = location.start;

    // TODO : find more minigful name for bookmark
    const title = `${this.lableFromPercentage(percentage * 100)} : At ${Math.floor(
        progress.value * 1000
    ) / 10}%`;

    const bookmark = {
        label: title,
        cfi,
        href,
    };
    // this.info.bookmarks.push(bookmark);
    // this.$db.set(this.info.id, this.info);

}
const removeBookmark = (bookmark) => {
    const index = this.info.bookmarks.findIndex(
        item => item.cfi === bookmark.cfi
    );
    this.info.bookmarks.splice(index, 1);
    // this.$db.insert(this.info.id, this.info);
}
</script>
  
<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  margin: 5px;
}
 #reader {
    user-select: none;
    height: 100%;
    width: 100%;
    position: relative;
    inset:0;
}
</style>
  