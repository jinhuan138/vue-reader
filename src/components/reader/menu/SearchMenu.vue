<template>
	<el-popover :popper-class="`popper ${reader.theme}`" width="350" trigger="hover" @show="startSearch" @hide="stopSearch">
		<template #reference>
			<el-button size="small" :icon="Search" circle />
		</template>
		<div class="el-popover__title">
			<el-input v-model="searchText" size="small" width="300" placeholder="search" />
		</div>
		<el-table :key="searchResult.length" :show-header="false" :data="searchResult" @cell-click="onNodeClick">
			<el-table-column prop="label" width="350"></el-table-column>
		</el-table>
	</el-popover>
</template>

<script setup>
import { useReaderStore } from '../utils/stores'
import { Search } from '@element-plus/icons-vue'
import { ref, watch, toRefs } from 'vue'

const reader = useReaderStore()
const props = defineProps({
	searchResult: {
		default: () => [],
		type: Array,
	},
})
const { searchResult } = toRefs(props)
const emit = defineEmits(['search', 'node-click'])
const searchText = ref('')

const stopSearch = () => {
	// this.$remote.getCurrentWebContents().stopFindInPage('clearSelection');
}
const startSearch = () => {
	if (searchText.value === '') return;
	// this.$remote.getCurrentWebContents().findInPage(this.searchText);
}
const onNodeClick = (data) => {
	emit('node-click', data)
}
let _searcTimer = null
watch(searchText, (text) => {
	if (text.length === 0) {
		return;
	}
	clearTimeout(_searcTimer);
	_searcTimer = setTimeout(() => {
		emit('search', text);
	}, 1000);
})
watch(searchResult, () => {
	startSearch();
})

</script>
