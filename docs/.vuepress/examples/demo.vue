<template>
    <div class="container">
        <div class="vueContainer">
            <VueReader url="/docs/files/alice.epub"></VueReader>
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader"
</script>
  
<style scoped>
.container {
    position: relative;
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