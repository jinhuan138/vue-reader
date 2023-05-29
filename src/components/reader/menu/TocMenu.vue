<template>
	<el-popover :popper-class="`popper ${props.theme}`" placement="bottom" width="350" trigger="hover">
		<div class="el-popover__title">
			Table of Content
		</div>
		<template #reference>
			<el-button size="small" icon="reading" circle />
		</template>
		<el-tree :data="props.toc" @node-click="onNodeClick" />
	</el-popover>
</template>

<script setup>

const props = defineProps({
	toc: {
		default: () => [],
		type: Array,
	},
	theme: {
		default: 'default',
		type: String,
	},
})
const emit = defineEmits(['node-click'])
const onNodeClick = (data) => {
	emit('node-click', data);
}
</script>

<style lang="scss" scoped></style>
