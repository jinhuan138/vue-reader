<template>
	<el-popover :popper-class="theme" trigger="hover">
		<template #reference>
			<el-button size="small" :icon="Operation" circle />
		</template>
		<table>
			<tr>
				<td> Flow </td>
				<td>
					<el-radio-group v-model="flow" size="small">
						<el-radio-button label="paginated" border>
							Paged
						</el-radio-button>
						<el-radio-button label="scrolled-doc" border>
							Scrolled
						</el-radio-button>
					</el-radio-group>
				</td>
			</tr>

			<tr>
				<td> Theme </td>
				<td>
					<el-radio-group v-model="theme" size="small">
						<el-radio-button label="default" border>
							Light
						</el-radio-button>
						<el-radio-button label="tan" border>
							Tan
						</el-radio-button>
						<el-radio-button label="dark" border>
							Dark
						</el-radio-button>
					</el-radio-group>
				</td>
			</tr>

			<tr>
				<td> Line Spacing </td>
				<td>
					<el-input-number v-model="lineSpacing" :precision="2" :step="0.1" :min="1.3" :max="2.0"
						size="small"></el-input-number>
				</td>
			</tr>

			<tr>
				<td> Font Size </td>
				<td>
					<el-input-number v-model="fontSize" :step="2" :min="10" :max="300" size="small"></el-input-number>
				</td>
			</tr>

			<tr>
				<td>Font</td>
				<td>
					<el-select v-model="font" class="font-select" width="50" size="small">
						<el-option label="Default" value=""></el-option>
						<el-option label="Arial" value="Arial"></el-option>
						<el-option label="Times New Roman" value="Times New Roman"></el-option>
					</el-select>
				</td>
			</tr>
		</table>
	</el-popover>
</template>

<script setup>
import { Operation } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'

const lineSpacing = ref(1.5)
const theme = ref('default')
const flow = ref('paginated')
const font = ref('')
const fontSize = ref(100)

const emit = defineEmits(['style-change', 'theme-change', 'flow-change'])

const updateStyle = () => {
	const rules = {
		'p': {
			"font-family": font.value !== "" ? `${font.value} !important` : "!invalid-hack",
			"font-size": fontSize.value !== "" ? `${fontSize.value} !important` : "!invalid-hack",
		},
		'body': {
			"font-family": font.value !== "" ? `${font.value} !important` : "!invalid-hack",
			// "text-align": `${theme.ta} !important`,
		},
		'*': {
			"line-height": `${lineSpacing.value} !important`,
			"font-size": fontSize.value !== "" ? `${fontSize.value}% !important` : "!invalid-hack",
		}
	};
	emit('style-change', rules)
}

onMounted(()=>{
	updateStyle()
})

watch(() => [lineSpacing, font, fontSize], () => {
	updateStyle();
})
watch(theme, (theme) => {
	emit('theme-change', theme)
})
watch(flow, (value) => {
	emit('flow-change', value)
})
</script>

<style lang="scss" scoped>
tr td:last-child {
	text-align: end;
}

.font-select .el-input--suffix .el-input__inner {
	padding-right: 0px;
}
</style>
