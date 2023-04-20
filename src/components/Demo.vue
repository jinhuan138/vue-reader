<template>
    <div>
        <div style='height: 100vh'>
            <VueReader url='/files/啼笑因缘.epub' :getRendition='getRendition'>
            </VueReader>
        </div>
        <div class="search">
            <input v-model.trim="searchText" type="text" placeholder="search" @keyup.enter="search" />
            <div class="searchResults">
                <div class="item" v-for="(item, index) in searchResults" :key="index" @click="go(item.cfi, $event)">
                    {{ index }}
                    <span
                        v-html='item.excerpt.trim().replace(searchText, `<span style="color: orange">${searchText}</span>`)'>
                    </span>
                </div>
                <div v-if="!searchResults.length">Empty</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

let rendition = null
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])
const getRendition = (val) => {
    rendition = val
    rendition.themes.default({
        '::selection': {
            background: 'orange'
        }
    })
}

const search = async () => {
    if (!searchText.value) return searchResults.value = []
    const res = await doSearch(searchText.value)
    searchResults.value = res.slice(0, 5)
}

const doSearch = (value) => {
    const { book } = rendition
    return Promise.all(book.spine.spineItems.map(item => {
        return item.load(book.load.bind(book)).then(doc => {
            const res = item.find(value);
            item.unload();
            return Promise.resolve(res);
        });
    })).then(res => Promise.resolve([].concat.apply([], res)));
}

const go = (href, e) => {
    rendition.display(href)
    e.stopPropagation();
    e.preventDefault();
}

</script>
<style scoped>
.search {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
}


.search .searchResults {
    width: 200px;
}

.search .searchResults .item {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid #000;
}

.search .searchResults .item:hover {
    background: rgba(0, 0, 0, 0.05);
}
</style>