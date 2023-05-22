<template>
    <!-- 头部 -->
    <el-header height="40px">
        <span id="left">
            <el-upload :auto-upload="false" v-show="false" ref="input" accept=".epub" :on-change="selectFile"
                :multiple="false">
            </el-upload>
            <el-button size="small" :icon="Plus" circle @click="select" title="导入图书" v-show="!showReader"></el-button>
            <div v-show="showReader">
                <ThemeMenuVue></ThemeMenuVue>
                <el-button size="small" :icon="Back" circle @click="back"></el-button>
            </div>
            <!-- <input type="file" name="select" :multiple="false" :visible="false" accept=".epub" v-show="false" ref="input"
                :onchange="onchange" /> -->
        </span>
        <span id="center">{{ bookName }}</span>
        <span id="right">
            <el-button size="small" :icon="Minus" circle />
            <el-button size="small" :icon="FullScreen" circle @click="fullScreen" />
            <el-button size="small" :icon="Close" circle />
        </span>
    </el-header>
    <!-- Home -->
    <transition name="el-fade-in-linear">
        <Home @update:currentBook="updateBook" v-model:showReader="showReader" v-show="!showReader" />
    </transition>
    <!-- Reader -->
    <transition name="el-fade-in-linear">
        <Reader :book="currentBook" v-show="showReader" />
    </transition>
</template>
<script setup>
import { Plus, Minus, Close, FullScreen, Back } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { db } from "./utils/db"
import { getFileMD5 } from "./utils/md5"
import Home from './Home.vue'
import Reader from './Reader.vue'
import Header from "@/components/reader/Header.vue"
import { ref, computed, getCurrentInstance } from "vue"
import ThemeMenuVue from './ThemeMenu.vue'

const showReader = ref(false)
const currentBook = ref('')
const bookName = ref('')

const updateBook = (url) => {
    currentBook.value = url
    bookName.value = url.replace('.epub', '')
    showReader.value = true
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
const back = () => {
    showReader.value = false
    bookName.value = ''
}
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
    const res = await db.books.get({ id })
    console.log(res)
    currentBook.value = res.buffer
    showReader.value = true
}
const input = ref(null)
const select = () => {
    input.value.$refs.uploadRef.$el.click()
}
const fullScreen = () => {
    const vm = getCurrentInstance();
    console.log(vm)
    // vm.$el.requestFullscreen()
}
</script>
<style scoped>
.el-header {
    text-align: center;
    vertical-align: middle;
    padding: 4px;
    -webkit-app-region: drag !important;
    -webkit-user-select: none;
}

.backdrop {
    backdrop-filter: blur(40px);
}

.el-button {
    margin-left: 4px;
}

#left {
    float: left;
    -webkit-app-region: no-drag !important;
    vertical-align: sub;
}

#left .el-button:first-of-type {
    margin-left: 0px;
}

#center {
    left: 50%;
    right: 50%;
    vertical-align: sub;
    font-size: 16px;
    line-height: 2;
    font-weight: 600;
    color: #000;
}

#right {
    float: right;
    -webkit-app-region: no-drag !important;
    vertical-align: sub;
}
</style>