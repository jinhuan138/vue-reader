<template>
    <div id="index" ref="app" :class="reader.theme">
        <!-- Home -->
        <transition name="el-fade-in-linear">
            <Home @update:currentBook="updateBook" v-model:showReader="showReader" v-if="!showReader" />
        </transition>
        <!-- Reader -->
        <transition name="el-fade-in-linear">
            <Reader :bookInfo="currentBook" v-if="showReader" @update:showReader="val => showReader = val" />
        </transition>
    </div>
</template>
<script setup>
import Home from './Home.vue'
import Reader from './Reader.vue'
import { useReaderStore } from './utils/stores'
import { ref } from "vue"

const reader = useReaderStore()
const showReader = ref(false)
const currentBook = ref({})

const updateBook = (info) => {
    currentBook.value = info
    showReader.value = true
}

</script>
<style lang="scss" scoped>
$border-radius: 4px;
$margin: 4px;
$padding: 4px;

#index {
    width: 100% !important;
    height: 100vh;
    border-radius: $border-radius;
}
</style>


<style lang="scss">
::-webkit-scrollbar {
    // display: none;
}

html,
body {
    margin: 0px;
    width: 100%;
    min-height: 100vh;
    // height: 100%;
    -webkit-font-smoothing: antialiased;
    // overflow: hidden;
}

.el-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.el-main {
    width: 100%;
    height: 100%;
    padding: 0px;
}

.el-button {
    border: none;
}

.el-table,
.el-table *,
.el-radio-button__inner,
.el-tree,
.el-button {
    background: inherit !important;
    color: inherit !important;
}

.default {
    width: 260px;
    background: #fff !important;
    color: #555 !important;
}

.dark {
    width: 260px !important;
    background: #444 !important;
    color: #eee !important;
}

.tan {
    width: 260px !important;
    background: #fdf6e3 !important;
    color: #002b36 !important;
}
</style>