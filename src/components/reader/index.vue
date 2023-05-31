<template>
    <div id="app" ref="app" class="default">
        <!-- Home -->
        <transition name="el-fade-in-linear">
            <Home @update:currentBook="updateBook" v-model:showReader="showReader" v-if="!showReader" />
        </transition>
        <!-- Reader -->
        <transition name="el-fade-in-linear">
            <Reader :book="currentBook" v-if="showReader" @update:showReader="val => showReader = val" />
        </transition>
    </div>
</template>
<script setup>
import Home from './Home.vue'
import Reader from './Reader.vue'
import { ref, computed } from "vue"
import ThemeMenuVue from './menu/ThemeMenu.vue'

const showReader = ref(false)
const currentBook = ref('')
const bookName = ref('')

const updateBook = (url) => {
    currentBook.value = url
    bookName.value = url.replace('.epub', '')
    showReader.value = true
}

</script>
<style lang="scss" scoped>
$border-radius: 4px;
$margin: 4px;
$padding: 4px;

#app {
    width: 100%;
    height: 100%;
    border-radius: $border-radius;
}
</style>


<style lang="scss">
::-webkit-scrollbar {
    display: none;
}

html,
body {
    margin: 0px;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
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
    background: #fff;
    color: #555;
}

.dark {
    background: #444;
    color: #eee;
}

.tan {
    background: #fdf6e3;
    color: #002b36;
}
</style>