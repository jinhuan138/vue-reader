<template>
    <div class="view">
        <VueReader class="view" url='/files/啼笑因缘.epub' :epubOptions='{
            flow: "scrolled",
            manager: "continuous",
        }'>
        </VueReader>
    </div>
</template>
<script setup>
import VueReader from "@/modules/index"
</script>
<style>
.view {
    height: 100vh
}

#view::-webkit-scrollbar {
    width: 0;
    height: 0;
}
</style>