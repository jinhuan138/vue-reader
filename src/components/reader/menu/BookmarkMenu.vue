<template>
  <el-popover :popper-class="`popper ${theme}`" width="350" trigger="hover">
    <div class="el-popover__title">
      Bookmarks
      <el-button size="small" icon="plus" circle @click="addBookmark" />
    </div>
    <template #reference>
      <el-button size="small" icon="collection-tag" circle />
    </template>

    <el-tree :data="bookmarks" node-key="id" @node-click="onNodeClick">
      <span slot-scope="{ node }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" icon="close" @click="removeBookmark(node)" />
        </span>
      </span>
    </el-tree>
  </el-popover>
</template>

<script setup>
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
const emit = defineEmits(['add-bookmark', 'node-click'])
const addBookmark = () => {
  emit('add-bookmark')
}
const removeBookmark = (data) => {
  emit('remove-bookmark', data)
}
const onNodeClick = () => {
  emit('node-click', data)
}
</script>
