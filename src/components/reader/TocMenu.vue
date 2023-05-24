<template>
	<el-popover :popper-class="`popper ${theme}`" placement="bottom" width="350" trigger="hover">
		<div class="el-popover__title">
			Table of Content
		</div>
		<template #reference>
			<el-button size="small" icon="reading" circle />
		</template>
		<el-tree :data="toc" @node-click="onNodeClick" />
	</el-popover>
</template>

<script>
export default {
	name: 'TocMenu',
	props: {
		theme: {
			default: 'default',
			type: String,
		},
		toc: {
			default: () => [],
			type: Array,
		}
	},
	methods: {
		onNodeClick(data) {
			this.$emit('node-click', data);
		}
	},
	mounted() {
		console.log(this.toc)
	}
}
</script>

<style lang="scss" scoped></style>
