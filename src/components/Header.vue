<template>
    <el-header height="40px">
        <span id="left">
            <!-- <el-upload title="导入图书" accept=".epub" :on-change="selectFile" :multiple="false">
                <el-button size="small" :icon="Plus" circle />
            </el-upload> -->
            <el-button size="small" :icon="Plus" circle @click="select"></el-button>
            <input type="file" name="select" :visible="false" accept=".epub" v-show="false" ref="input"
                :onchange="onchange" />
        </span>
        <span id="center">vue-reader</span>
        <span id="right">
            <el-button size="small" :icon="Minus" circle />
            <el-button size="small" :icon="FullScreen" circle />
            <el-button size="small" :icon="Close" circle />
        </span>
    </el-header>
</template>

<script setup>
import { ref } from "vue"
import { Plus, Minus, Close, FullScreen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const input = ref(null)
const router = useRouter()
const selectFile = (file) => {
    const { raw, name, size } = file
    router.push({ name: 'reader', params: { file: { raw, name, size }, name } })
    console.log(file)
}
const select = () => {
    input.value.click()
}
const onchange = (e) => {
    console.log(e)

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
}

#right {
    float: right;
    -webkit-app-region: no-drag !important;
    vertical-align: sub;
}
</style>