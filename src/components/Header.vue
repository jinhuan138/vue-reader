<template>
    <el-header height="40px">
        <span id="left">
            <el-button size="small" :icon="Plus" circle @click="addFiles" />
        </span>
        <span id="center">vue-reader</span>
        <span id="right">
            <el-button size="small" :icon="Minus" circle @click="minimizeWindow" />
            <el-button size="small" :icon="FullScreen" circle @click="maximizeWindow" />
            <el-button size="small" :icon="Close" circle @click="closeWindow" />
        </span>
    </el-header>
</template>

<script setup>
import { Plus, Minus, Close, FullScreen } from '@element-plus/icons-vue'

</script>

<style>
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