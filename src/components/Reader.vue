<template>
    <div style="height: 90vh">
        <VueReader :location="location" :url="url" @update:location="locationChange" :getRendition="getRendition"
            :tocChanged="val => toc = val">
        </VueReader>
        <div class="page">
            {{ page }}
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
import { db } from "../utils/db";
// import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from "vue";
import { useData, useRoute } from 'vitepress'


const route = useRoute()
console.log(route)
const { name, id } = route.query
console.log(name)
const defaultBook = '啼笑因缘'
const book = name ? name.replace(".epub", '') : defaultBook
const url = computed(() => {
    if (id) {
        //indexDB导入
        // const res = await db.books.get({ id })
        // console.log(res.info.buffer)
        // return res.info.buffer
    } else if (name) {
        //url导入
        return `/books/${name}`
    } else {
        return `/files/${defaultBook}.epub`
    }
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
onMounted(async () => {

    console.log(route)
    console.log(useData())
    // const res = await db.books.get({
    //     id: 2
    // })
    // console.log(url)
})

let rendition = null
const getRendition = val => rendition = val
const location = ref(2)
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
  