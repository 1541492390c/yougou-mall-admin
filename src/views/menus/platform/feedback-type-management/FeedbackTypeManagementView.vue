<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { FeedbackType } from '@/interface/platform'
import { deleteFeedbackTypeApi, getFeedbackTypePagesApi, updateFeedbackTypeApi } from '@/api/platform/feedback-type-api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isEmpty } from '@/utils'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const tableData = ref<Array<FeedbackType>>([])

onMounted(() => {
	getTableData()
})

// 获取表单信息
const getTableData = (): void => {
	getFeedbackTypePagesApi(currentPage.value, currentSize.value).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData()
}

// 更新反馈类型
const updateFeedbackType = (value: FeedbackType): void => {
	if (isEmpty(value.name)) {
		ElMessage.error('反馈类型名称不能为空')
		return
	}
	updateFeedbackTypeApi(value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 删除反馈类型
const deleteFeedbackType = (value: number, index: number): void => {
	ElMessageBox.confirm('此操作将删除反馈类型,是否继续?', '删除反馈类型').then(() => {
		deleteFeedbackTypeApi(value).then((res) => {
			if (res) {
				ElMessage.success('删除成功')
				tableData.value.splice(index, 1)
			}
		}).catch((err) => {
			console.log(err)
		})
	}).catch(() => {
		ElMessage.info('操作已取消')
	})
}
</script>

<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--ID-->
			<el-table-column label='ID' align='center' prop='feedbackTypeId' />
			<!--反馈类型名称-->
			<el-table-column label='反馈类型名称' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.name' placeholder='请输入反馈类型名称' />
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateFeedbackType(scope.row)' type='info' text class='button'>编辑</el-button>
					<el-button @click='deleteFeedbackType(scope.row.feedbackTypeId, scope.$index)' type='primary' text
										 class='button'>删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<div class='pagination'>
			<el-pagination :total='total' :page-size='currentSize' :current-page='currentPage'
										 @current-change='currentPageChange'
										 small layout='prev, pager, next' background />
		</div>
	</div>
</template>

<style scoped lang='scss'>

</style>