<template>
    <Header v-model.bookName="bookName" v-model.showReader="showReader" />
    <transition name="el-fade-in-linear">
        <Home @update:currentBook="updateBook" v-model:showReader="showReader" v-show="!showReader" />
    </transition>
    <transition name="el-fade-in-linear">
        <Reader :book="currentBook" v-show="showReader" />
    </transition>
</template>
<script setup>
import Home from './Home.vue'
import Reader from './Reader.vue'
import Header from "@/components/reader/Header.vue"

import { ref, computed } from "vue"
const showReader = ref(false)
const currentBook = ref('')

const updateBook = (url) => {
    currentBook.value = url
    showReader.value = true
}

const bookName = computed(() => currentBook.value.replace('.epub', ''))

</script>
<style></style>