<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { getUserPagesApi } from '@/api/user/user-api'
import { User } from '@/interface/user'

const tableData = ref<Array<User>>()
const total = ref<number>(0)
const currentPage = ref<number>(1)

const gender = computed(() => (value: number) => {
	switch (value) {
		case 0:
			return '保密'
		case 1:
			return '男'
		case 2:
			return '女'
	}
})

onMounted(() => {
	getTableData()
})

const getTableData = (): void => {
	getUserPagesApi(currentPage.value).then((res) => {
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
</script>

<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='头像' align='center'>
				<template #default='scope'>
					<img :src='scope.row.avatar' alt='' class='product-img'>
				</template>
			</el-table-column>
			<el-table-column label='昵称' prop='nickname' align='center' />
			<el-table-column label='性别' align='center'>
				<template #default='scope'>
					<span>{{gender(scope.row.gender)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='生日' prop='birthday' align='center' />
			<el-table-column label='状态' align='center'>
			</el-table-column>
			<el-table-column label='操作' align='center'>
			</el-table-column>
		</el-table>
		<div class='pagination'>
			<el-pagination :total='total' :page-size='10' :current-page='currentPage' @current-change='currentPageChange'
										 small layout='prev, pager, next' background />
		</div>
	</div>
</template>

<style scoped lang='scss'>
</style>