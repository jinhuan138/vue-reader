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
                    <a :href="'/docs/reader?name='+book.url" target="_self">
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
                    </a>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
  
<script setup>
import Header from "comps/Header.vue"
import { saveAs } from 'file-saver';
import books from "../../public/books/books.json";
import { ref, reactive, toRefs, onBeforeMount, onMounted, onBeforeUnmount } from "vue"

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
    // bookList.value = books.splice(0, 1)
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
const publishDate = (val) => {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    return `${year}--${month}--${day}`;
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
//book info
const formatSize = (size) => {
    return size ? size / 1024 / 1024 > 1 ? parseFloat(
        this.props.currentBook.size / 1024 / 1024 + ""
    ).toFixed(2) + "Mb"
        : parseInt(this.props.currentBook.size / 1024 + "") + "Kb"
        :
        "0" + "Kb"
}
const exportFile = (id) => {
    saveAs(
        new Blob([result]),
        // this.props.currentBook.name +
        // `.${this.props.currentBook.format.toLocaleLowerCase()}`
    )
}
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
  