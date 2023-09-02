<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { getUserPagesApi } from '@/api/user/user-api'
import { User } from '@/interface/user'
import Pagination from '@/components/pagination/Pagination.vue'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const tableData = ref<Array<User>>()

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

const state = computed(() => (value: number) => {
	switch (value) {
		case 1:
			return '正常'
		case 0:
			return '禁用'
	}
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
					<el-avatar :src='scope.row.avatar' :size='60' alt='' class='product-img' />
				</template>
			</el-table-column>
			<el-table-column label='昵称' prop='nickname' align='center' />
			<el-table-column label='性别' align='center'>
				<template #default='scope'>
					<span>{{gender(scope.row.gender)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='生日' prop='birthday' align='center'>
				<template #default='scope'>
					<span>{{scope.row.birthday ? scope.row.birthday : '--'}}</span>
				</template>
			</el-table-column>
			<el-table-column label='状态' align='center'>
				<template #default='scope'>
					<span :style="{color: (scope.row.state === 1 ? '#67C23A' : '#F56C6C')}">{{state(scope.row.state)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' align='center'>
				<el-button link type='info'>详情</el-button>
				<el-button link type='info'>禁用</el-button>
				<el-button link type='danger'>删除</el-button>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
	</div>
</template>

<style scoped lang='scss'>
</style>