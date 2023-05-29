<template>
    <!-- Home -->
    <transition name="el-fade-in-linear">
        <Home @update:currentBook="updateBook" v-model:showReader="showReader" v-if="!showReader" />
    </transition>
    <!-- Reader -->
    <transition name="el-fade-in-linear">
        <Reader :book="currentBook" v-if="showReader" @update:showReader="val => showReader = val" />
    </transition>
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