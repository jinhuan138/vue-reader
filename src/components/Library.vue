<template>
    <el-main :class="'main' + agent">
        <div class="grid" ref="grid">
            <div v-for="(book, index) in bookList" :key="index">
                <el-popover>
                    <!-- 提示 -->
                    <div class="tip">
                        <p v-if="book.creator">作者: {{ book.creator }}</p>
                        <p v-if="book.description">
                            介绍: {{ trunc(book.description, 30) }}
                        </p>
                        <p v-if="book.publisher">出版社: {{ book.publisher }}</p>
                        <p v-if="book.date">出版日期: {{ book.date | publishDate }}</p>
                        <p v-if="book.language">语言: {{ book.language }}</p>
                    </div>
                    <!-- 主体 -->
                    <router-link :to="{ name: 'Reader', path: '/reader', params: { url: book.url } }" slot="reference">
                        <el-card ref="card" shadow="hover" :class="'box-card' + agent" :body-style="{ padding: '0px' }">
                            <el-image :src="coverPath(book.url)" :fit="'fill'" :class="'el-image' + agent">
                                <div slot="error" class="image-slot">
                                    <el-image :src="$withBase('/books/cover/default-cover.png')" :fit="'fill'">
                                    </el-image>
                                </div>
                            </el-image>
                            <div :class="'title' + agent" :style="{
                                background: book.bgColorFromCover
                                    ? book.bgColorFromCover
                                    : '#6d6d6d',
                                            }">
                                {{ trunc(book.title, 30) }}
                            </div>
                        </el-card>
                    </router-link>
                </el-popover>
            </div>
        </div>
    </el-main>
</template>
  
<script>
// import books from "../../public/books/books.json";
export default {
    name: 'Library',
    data() {
        return {
            bookList: [],
            maxColWidth: 280,
            gap: 32,
            agent: "",//default pc
        };
    },
    props: {
        useMin: {
            type: Boolean, // Place items in lower column
            default: false,
        },
    },
    filters: {
        publishDate(val) {
            const date = new Date(val);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDay();
            return `${year}--${month}--${day}`;
        },
    },
    beforeMount() {
        // this.bookList = books
        const sUserAgent = navigator.userAgent.toLowerCase();
        if (
            /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(
                sUserAgent
            )
        ) {
            //移动端页面
            this.agent = "-phone";
            this.maxColWidth = 100;
            this.gap = 5;
        }
    },
    mounted() {
        // console.log("allBooks", books);
        if (!this.bookList.length) return
        this.initStyle();
        this.positionItems();
        window.addEventListener("resize", this.resize);
    },
    methods: {
        trunc(str, n) {
            return str.length > n ? `${str.substr(0, n - 3)}...` : str;
        },
        coverPath(name) {
            return this.$withBase(
                "/books/cover/" + name.replace(".epub", "") + ".webp"
            );
        },
        initStyle() {
            this.items = this.$refs["grid"].children;
            if (this.items.length === 0) return;
            this.$el.style.position = "relative";
            Array.prototype.forEach.call(this.items, (item) => {
                item.style.position = "absolute";
                item.style.maxWidth = `${this.maxColWidth}px`;
                item.style.transition =
                    "top 0.2s ease, left 0.2s ease, right 0.2s ease, buttom 0.2s ease";
            });
        },
        //样式
        setup() {
            const { width } = this.$el.getBoundingClientRect();
            let numCols = Math.floor(width / this.colWidth()) || 1;
            const cols = [];

            if (this.maxCols && numCols > this.maxCols) {
                numCols = this.maxCols;
            }

            for (let i = 0; i < numCols; i += 1) {
                cols[i] = {
                    height: 0,
                    top: 0,
                    index: i,
                };
            }

            const wSpace = width - numCols * this.colWidth() + this.gap;

            return {
                cols,
                wSpace,
            };
        },
        resize() {
            setTimeout(this.positionItems(), 200);
        },
        positionItems() {
            if (this.items.length === 0) return;

            let { cols, wSpace } = this.setup();

            wSpace = Math.floor(wSpace / 2);

            Array.prototype.forEach.call(this.items, (item, i) => {
                const min = this.nextCol(cols, i);

                const left = min.index * this.colWidth() + wSpace;

                item.style.left = `${left}px`;
                item.style.top = `${min.height + min.top}px`;

                min.height += min.top + item.getBoundingClientRect().height;
                min.top = this.gap;
            });

            this.$el.style.height = `${this.getMax(cols).height}px`;
        },
        colWidth() {
            let width = this.items[0].getBoundingClientRect().width + this.gap;
            return width;
        },
        nextCol(cols, i) {
            if (this.useMin) return this.getMin(cols);
            return cols[i % cols.length];
        },
        getMax(cols) {
            let max = cols[0];
            cols.forEach((col) => {
                if (col.height > max.height) max = col;
            });
            return max;
        },
        getMin(cols) {
            let min = cols[0];
            cols.forEach(col => {
                if (col.height < min.height) min = col;
            });
            return min;
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resize);
    },
};
</script>
  
<style scopped>
.main {
    margin-top: 40px;
    height: 100%;
}

.main-phone {
    font-size: 12px;
    height: 100%;
}

.grid {
    height: 100%;
}

.tip {
    width: 280px;
}

.box-card {
    width: 170px;
    height: 250px;
    /* background: #fff; */
    user-select: none;
}

.box-card-phone {
    width: 85px;
    height: 125px;
    /* background: #fff; */
    user-select: none;
}

.el-image {
    height: 200px;
    width: 100%;
}

.el-image-phone {
    height: 100px;
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

.title-phone {
    height: 60px;
}
</style>
  