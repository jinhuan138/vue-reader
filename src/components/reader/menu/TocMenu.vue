<template>
  <el-popover
    :popper-class="`popper ${reader.theme}`"
    placement="bottom"
    :width="380"
    trigger="hover"
    :popper-style="{ height: '85%' }"
  >
    <div class="el-popover__title">Table of Content</div>
    <template #reference>
      <el-button size="small" :icon="Reading" circle />
    </template>
    <el-tree :data="props.toc" @node-click="onNodeClick" />
  </el-popover>
</template>

<script setup>
import { Reading } from '@element-plus/icons-vue'
import { useReaderStore } from '../utils/stores'

const reader = useReaderStore()
const props = defineProps({
  toc: {
    default: () => [],
    type: Array,
  },
})
const emit = defineEmits(['node-click'])
const onNodeClick = (data) => {
  emit('node-click', data)
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.popper {
  .el-tree {
    max-height: 95%;
    max-width: 100%;
    overflow: auto;
    word-wrap: wrap;
  }
}
</style>
