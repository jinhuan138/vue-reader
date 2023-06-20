<template>
	<el-popover :popper-class="`popper ${reader.theme}`" placement="bottom" width="350" trigger="hover">
		<div class="el-popover__title">
			Table of Content
		</div>
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
	}
})
const emit = defineEmits(['node-click'])
const onNodeClick = (data) => {
	emit('node-click', data);
}
</script>

<style lang="scss" scoped></style>
