<template>
    <el-container direction="vertical">
        <titlebar backdrop shadow>
            <el-upload :auto-upload="false" v-show="false" ref="input" accept=".epub" :on-change="selectFile"
                :multiple="false">
                <!-- <input type="file" name="select" :multiple="false" :visible="false" accept=".epub" v-show="false" ref="input"
            :onchange="onchange" /> -->
            </el-upload>
            <el-button size="small" :icon="Plus" circle @click="addFiles" title="导入图书"></el-button>
        </titlebar>
        <!-- 书籍列表 -->
        <el-main class='main' ref="main">
            <div class="grid" ref="grid">
                <div v-for="({ url, bgColorFromCover, title, creator, publisher, description, date, publishDate, language, size }, index) in bookList"
                    :key="index">
                    <!-- 主体 -->
                    <el-card @click="reader(url)" ref="card" shadow="hover" class='box-card'
                        :body-style="{ padding: '0px' }">
                        <el-image :src="coverPath(url)" fit='fill' class='el-image'>
                            <div slot="error" class="image-slot">
                                <el-image src="/books/cover/default-cover.png" fit='fill'>
                                </el-image>
                            </div>
                        </el-image>
                        <!-- 提示 -->
                        <el-popover trigger="hover" placement='right'>
                            <template #reference>
                                <div class='title' :style="{
                                    background: bgColorFromCover
                                        ? bgColorFromCover
                                        : '#6d6d6d',
                                }">
                                    {{ trunc(title, 30) }}
                                </div>
                            </template>
                            <!-- 书籍信息 -->
                            <div>
                                <el-button type="primary" round icon="Download" @click="download(url)">下载</el-button>
                                <p v-if="creator">作者: {{ creator }}</p>
                                <p v-if="description">
                                    描述: <span :title="description"> {{ trunc(description, 30) }}</span>
                                </p>
                                <p v-if="publisher">出版社: {{ publisher }}</p>
                                <p v-if="date">出版日期: {{ date || publishDate }}</p>
                                <p v-if="language">语言: {{ language }}</p>
                                <p v-if="size">文件大小: {{ formatSize(size) }}</p>
                            </div>
                        </el-popover>
                    </el-card>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
  
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { saveAs } from 'file-saver';
import { db } from "./utils/db"
import { getFileMD5 } from "./utils/md5"
import books from "../../../public/books/books.json";
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
    }
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
    return size / 1024 / 1024 > 1 ? parseFloat(size / 1024 / 1024 + "").toFixed(2) + "Mb"
        : parseInt(size / 1024 + "") + "Kb"
}
const download = (url) => {
    saveAs("/books/" + url, url);
}
const emit = defineEmits(['update:currentBook'])
const reader = (url) => {
    emit('update:currentBook', url)
}
//导入
const selectFile = async (item) => {
    const { raw, name, size } = item
    const md5 = await getFileMD5(raw)
    const res = await db.books.get({ md5 })
    if (res) return ElMessage.error('图书重复')
    const reader = new FileReader()
    reader.onerror = (error) => {
        console.log(error)
    }
    reader.onloadend = (e) => {
        const file = { buffer: reader.result, size, name, md5 }
        saveFile(file)
    }
    reader.readAsArrayBuffer(raw)
}
const saveFile = async (file) => {
    //保存文件
    const id = await db.books.add(file);
    // router.push({ name: 'reader', params: { id } })
}
const input = ref(null)
const addFiles = () => {
    input.value.$refs.uploadRef.$el.click()
}
const onchange = (e) => {
    //原生input获取文件
    const file = e.target.files[0]
    const { name, size } = file
    console.log(file)
    const reader = new FileReader()
    reader.onerror = (error) => reject(error);
    reader.onloadend = (e) => {
        console.log(reader.result)
    }
    reader.readAsArrayBuffer(file)
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
  