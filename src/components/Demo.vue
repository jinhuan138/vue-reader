<template>
    <div>
        <div style="height: 100vh">
            <VueReader url="/files/alice.epub">
            </VueReader>
        </div>
        <div style="height: 100vh">
            <VueReader url="/files/啼笑因缘.epub">
            </VueReader>
        </div>
    </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
</script>