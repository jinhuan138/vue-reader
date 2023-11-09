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
          <el-button
            type="text"
            icon="close"
            @click="() => removeBookmark(node)"
          />
        </span>
      </span>
    </el-tree>
  </el-popover>
</template>

<script>
export default {
  name: 'BookmarkMenu',
  props: {
    bookmarks: {
      default: () => {},
      type: Array,
    },
    theme: {
      default: 'default',
      type: String,
    },
  },
  methods: {
    addBookmark() {
      this.$emit('add-bookmark')
    },
    removeBookmark(data) {
      this.$emit('remove-bookmark', data)
    },
    onNodeClick(data) {
      this.$emit('node-click', data)
    },
  },
}
</script>

<style lang="scss" scoped></style>
