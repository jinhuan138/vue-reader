<template>
  <div style="position: relative" :style="{ height: url ? '100vh' : '50px' }">
    <div style="height: 100vh" v-if="url">
      <VueReader
        url="/files/啼笑因缘.epub"
      />
    </div>
    <!-- <input
      type="file"
      :multiple="false"
      accept=".epub"
      @change="onchange"
      class="input"
    /> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
// import VueReader from 'vue-reader'
import VueReader from '../modules/index'
const url = '/files/啼笑因缘.epub'
</script>
<style>
.input {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
}
</style>