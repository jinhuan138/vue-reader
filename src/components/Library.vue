<template>
    <el-container direction="vertical">
        <!-- 头部 -->
        <Header />
        <!-- 书籍 -->
        <el-main class='main' ref="main">
            <div class="grid" ref="grid">
                <div v-for="(book, index) in bookList" :key="index">
                    <!-- 提示 -->
                    <!-- <div class="tip">
                        <p v-if="book.creator">作者: {{ book.creator }}</p>
                        <p v-if="book.description">
                            介绍: {{ trunc(book.description, 30) }}
                        </p>
                        <p v-if="book.publisher">出版社: {{ book.publisher }}</p>
                        <p v-if="book.date">出版日期: {{ book.date | book.publishDate }}</p>
                        <p v-if="book.language">语言: {{ book.language }}</p>
                    </div> -->
                    <!-- 主体 -->
                    <router-link :to="{ name: 'reader', params: { name: book.url } }" slot="reference">
                        <el-card ref="card" shadow="hover" class='box-card' :body-style="{ padding: '0px' }">
                            <el-image :src="coverPath(book.url)" fit='fill' class='el-image'>
                                <div slot="error" class="image-slot">
                                    <el-image src="/books/cover/default-cover.png" fit='fill'>
                                    </el-image>
                                </div>
                            </el-image>
                            <div class='title'
                                :style="{
                                    background: book.bgColorFromCover
                                        ? book.bgColorFromCover
                                        : '#6d6d6d',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }">
                                {{ trunc(book.title, 30) }}
                            </div>
                        </el-card>
                    </router-link>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
  
<script setup>
import Header from "comps/Header.vue"
import books from "/public/books/books.json";
import { ref, reactive, toRefs, onBeforeMount, onMounted, onBeforeUnmount, defineProps } from "vue"

const grid = ref(null)
const main = ref(null)
const data = reactive({
    bookList: [],
    maxColWidth: 280,
    gap: 32,
})
let items = []

const { bookList, maxColWidth, gap } = toRefs(data)
const props = defineProps({
    useMin: {
        type: Boolean,
        default: false
    },
    maxCols: {
        type: Number, // Maximum number of colums. Default: Infinite
        default: Infinity,
    },
})
const { useMin, maxCols } = props

onBeforeMount(() => {
    bookList.value = books
})
onMounted(() => {
    if (!bookList.value.length) return
    initStyle()
    positionItems()
    window.addEventListener("resize", resize);
})
onBeforeUnmount(() => {
    window.removeEventListener("resize", resize);
})
const coverPath = (name) => {
    return "/books/cover/" + name.replace(".epub", ".jpg")
}
const trunc = (str, n) => {
    return str.length > n ? `${str.substr(0, n - 3)}...` : str
}
//style
const initStyle = () => {
    items = grid.value.children;
    if (items.length === 0) return;
    main.value.$el.style.position = "relative";
    Array.prototype.forEach.call(items, (item) => {
        item.style.position = "absolute";
        item.style.maxWidth = `${maxColWidth.value}px`;
        item.style.transition =
            "top 0.2s ease, left 0.2s ease, right 0.2s ease, buttom 0.2s ease";
    });
}
const positionItems = () => {
    if (items.length === 0) return;

    let { cols, wSpace } = setup();

    wSpace = Math.floor(wSpace / 2);

    Array.prototype.forEach.call(items, (item, i) => {
        const min = nextCol(cols, i);

        const left = min.index * colWidth() + wSpace;

        item.style.left = `${left}px`;
        item.style.top = `${min.height + min.top}px`;

        min.height += min.top + item.getBoundingClientRect().height;
        min.top = gap.value;
    });
    main.value.$el.style.height = `${getMax(cols).height}px`;
}
const nextCol = (cols, i) => {
    if (useMin) return getMin(cols);
    return cols[i % cols.length];
}
const colWidth = () => {
    let width = items[0].getBoundingClientRect().width + gap.value;
    return width;
}
const getMin = (cols) => {
    let min = cols[0];
    cols.forEach(col => {
        if (col.height < min.height) min = col;
    });
    return min;
}
const getMax = (cols) => {
    let max = cols[0];
    cols.forEach((col) => {
        if (col.height > max.height) max = col;
    });
    return max;
}
const setup = () => {
    const { width } = main.value.$el.getBoundingClientRect();
    let numCols = Math.floor(width / colWidth()) || 1;
    const cols = [];

    if (maxCols && numCols > maxCols) {
        numCols = maxCols;
    }

    for (let i = 0; i < numCols; i += 1) {
        cols[i] = {
            height: 0,
            top: 0,
            index: i,
        };
    }

    const wSpace = width - numCols * colWidth() + gap.value

    return {
        cols,
        wSpace,
    };
}
const resize = () => {
    setTimeout(positionItems(), 200);
}
// export default {
//     name: 'Library',
//     data() {
//         return {
//             bookList: [],
//             maxColWidth: 280,
//             gap: 32,
//             agent: "",//default pc
//         };
//     },
//     props: {
//         useMin: {
//             type: Boolean, // Place items in lower column
//             default: false,
//         },
//     },
//     filters: {
//         publishDate(val) {
//             const date = new Date(val);
//             const year = date.getFullYear();
//             const month = date.getMonth() + 1;
//             const day = date.getDay();
//             return `${year}--${month}--${day}`;
//         },
//     },
//     mounted() {
//         if (!this.bookList.length) return
//         this.initStyle();
//         this.positionItems();
//         window.addEventListener("resize", this.resize);
//     },
//     methods: {
//         trunc(str, n) {
//             return str.length > n ? `${str.substr(0, n - 3)}...` : str;
//         },
//         coverPath(name) {
//             return "/books/cover/" + name.replace(".epub", ".jpg")
//         },
//         initStyle() {
//             this.items = this.$refs["grid"].children;
//             if (this.items.length === 0) return;
//             this.$el.style.position = "relative";
//             Array.prototype.forEach.call(this.items, (item) => {
//                 item.style.position = "absolute";
//                 item.style.maxWidth = `${this.maxColWidth}px`;
//                 item.style.transition =
//                     "top 0.2s ease, left 0.2s ease, right 0.2s ease, buttom 0.2s ease";
//             });
//         },
//         //样式
//         setup() {
//             const { width } = this.$el.getBoundingClientRect();
//             let numCols = Math.floor(width / this.colWidth()) || 1;
//             const cols = [];

//             if (this.maxCols && numCols > this.maxCols) {
//                 numCols = this.maxCols;
//             }

//             for (let i = 0; i < numCols; i += 1) {
//                 cols[i] = {
//                     height: 0,
//                     top: 0,
//                     index: i,
//                 };
//             }

//             const wSpace = width - numCols * this.colWidth() + this.gap;

//             return {
//                 cols,
//                 wSpace,
//             };
//         },
//         resize() {
//             setTimeout(this.positionItems(), 200);
//         },
//         positionItems() {
//             if (this.items.length === 0) return;

//             let { cols, wSpace } = this.setup();

//             wSpace = Math.floor(wSpace / 2);

//             Array.prototype.forEach.call(this.items, (item, i) => {
//                 const min = this.nextCol(cols, i);

//                 const left = min.index * this.colWidth() + wSpace;

//                 item.style.left = `${left}px`;
//                 item.style.top = `${min.height + min.top}px`;

//                 min.height += min.top + item.getBoundingClientRect().height;
//                 min.top = this.gap;
//             });

//             this.$el.style.height = `${this.getMax(cols).height}px`;
//         },
//         colWidth() {
//             let width = this.items[0].getBoundingClientRect().width + this.gap;
//             return width;
//         },
//         nextCol(cols, i) {
//             if (this.useMin) return this.getMin(cols);
//             return cols[i % cols.length];
//         },
//         getMax(cols) {
//             let max = cols[0];
//             cols.forEach((col) => {
//                 if (col.height > max.height) max = col;
//             });
//             return max;
//         },
//         getMin(cols) {
//             let min = cols[0];
//             cols.forEach(col => {
//                 if (col.height < min.height) min = col;
//             });
//             return min;
//         },
//     },
//     beforeDestroy() {
//         window.removeEventListener("resize", this.resize);
//     },
// };
</script>
  
<style scoped lang="scss">
.main {
    /* margin-top: 40px; */
    .grid {
        margin: 40px;
        .box-card {
            width: 170px;
            height: 250px;
            user-select: none;

            .el-image {
                height: 200px;
                width: 100%;
            }

            .title {
                width: 100%;
                height: 50px;
                font-size: 14px;
                display: inline-grid;
                align-content: center;
                text-align: center;
                color: #ffffff;
                position: relative;
                top: -3px;
            }
        }
    }
}

</style>
  