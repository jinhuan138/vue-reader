<template>
    <div style='position: relative;height: 10vh'>
        <div style='height: 100vh' v-if="url">
            <VueReader :url='url' :title='title' />
        </div>
        <input type="file" :multiple="false" accept=".epub" :onchange="onchange" class="input">
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { VueReader } from '@/modules/index'

const url = ref(null), title = ref('')
const onchange = (e) => {
    const file = e.target.files[0];
    const { name } = file
    title.value = name.replace('.epub', '')
    if (window.FileReader) {
        var reader = new FileReader();
        reader.onloadend = e => url.value = reader.result
        reader.readAsArrayBuffer(file);
    }
}
</script>
<style>
.input {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
    text-align: center;
}
</style>