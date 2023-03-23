
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" title="啼笑因缘"></VueReader>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from "../lib/index.min.js";
// import VueReader from "./modules/VueReader/VueReader.vue";
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
  overflow: hidden;
}
.vueContainer {
  font-size: 16px;
  position: absolute;
  top: 0px;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
}
</style>
