<template>
  <el-popover :popper-class="`popper ${theme}`" width="350" trigger="hover">
    <div class="el-popover__title">
      Bookmarks
      <el-button size="small" :icon="Plus" circle @click="addBookmark" />
    </div>
    <template #reference>
      <el-button size="small" :icon="CollectionTag" circle />
    </template>

    <el-tree :data="bookmarks" node-key="cfi" @node-click="onNodeClick">
      <template #default="slotProps">
        <span v-if="slotProps?.data" class="custom-tree-node">
          <span>{{ slotProps.data.label }}</span>
          <span>
            <el-button
              type="text"
              :icon="Close"
              @click.stop="removeBookmark(slotProps.data)"
            />
          </span>
        </span>
      </template>
    </el-tree>
  </el-popover>
</template>

<script setup>
import { Close, CollectionTag, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  bookmarks: {
    default: () => [],
    type: Array,
  },
  theme: {
    default: 'default',
    type: String,
  },
})
const emit = defineEmits(['add-bookmark', 'remove-bookmark', 'node-click'])
const addBookmark = () => {
  emit('add-bookmark')
}
const removeBookmark = (data) => {
  emit('remove-bookmark', data)
}
const onNodeClick = (data) => {
  emit('node-click', data)
}
</script>

<style scoped>
.custom-tree-node {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
