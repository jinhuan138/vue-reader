<template>
    <div>
        <div class="reader">
            <div class="viewHolder">
                <div class="view" ref="view"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue"
const view = ref(null)
defineExpose({
    view: view.value
})
</script>
<style>
.reader {
    position: absolute;
    inset: 50px 50px 20px;
}

.viewHolder {
    height: 100%;
    width: 100%;
    /* overflow: hidden; */
    position: relative;
}

.view {
    height: 100%;
}
</style>