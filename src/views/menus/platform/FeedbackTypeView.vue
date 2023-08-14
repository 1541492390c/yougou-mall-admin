<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='ID' align='center' prop='feedbackTypeId' />
			<el-table-column label='反馈类型名称' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.name' placeholder='请输入反馈类型名称' />
				</template>
			</el-table-column>
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button type='info' text class='button'>编辑</el-button>
					<el-button type='primary' text class='button'>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { FeedbackType } from '@/interface/platform'
import { getFeedbackTypePagesApi } from '@/api/platform/feedback-type-api'

const tableData = ref<Array<FeedbackType>>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)

onMounted(() => {
	getTableData(currentPage.value)
})

// 获取表单信息
const getTableData = (pageNum: number): void => {
	getFeedbackTypePagesApi(pageNum).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<style scoped lang='scss'>

</style>