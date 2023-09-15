<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { getFeedbackPagesApi } from '@/api/user/feedback-api'
import { Feedback } from '@/interface/user'
import FeedbackDetailDialog from '@/components/dialog/detail/FeedbackDetailDialog.vue'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const showFeedbackDetailDialog = ref<boolean>(false)
const currentFeedback = ref<Feedback | undefined>()
const tableData = ref<Array<Feedback>>([])

onMounted(() => {
	getTableData()
})

const getTableData = (): void => {
	getFeedbackPagesApi().then((res) => {
		total.value = res.data.total
		tableData.value = res.data.list
	}).catch((err) => {
		console.log(err)
	})
}

const openFeedbackDetailDialog = (feedback: Feedback): void => {
	showFeedbackDetailDialog.value = true
	currentFeedback.value = feedback
}

const closeFeedbackDetailDialog = (): void => {
	showFeedbackDetailDialog.value = false
	currentFeedback.value =undefined
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
}
</script>

<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='反馈类型' prop='feedbackTypeName' align='center' />
			<el-table-column label='联系方式(电话/邮箱)' prop='contactWay' align='center' />
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='openFeedbackDetailDialog(scope.row)' link type='info'>详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :current='currentPage' :size='currentSize' @current-change='currentPageChange' />
		<!--反馈详情对话框-->
		<feedback-detail-dialog :show='showFeedbackDetailDialog' :feedback='currentFeedback'
														@close-dialog='closeFeedbackDetailDialog' />
	</div>
</template>

<style scoped lang='scss'>

</style>