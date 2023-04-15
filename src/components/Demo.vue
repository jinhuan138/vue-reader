<template>
    <div style="height: 50vh">
        <VueReader url="/files/啼笑因缘.epub" />
    </div>
</template>
<script setup>
import { VueReader } from "@/modules/index";
</script>
<style>
button{
    color: var(--el-button-hover-text-color);
    border-color: var(--el-button-hover-border-color);
    background-color: var(--el-button-hover-bg-color);
   
  

}
/*  */
button:hover{
    
}
</style>