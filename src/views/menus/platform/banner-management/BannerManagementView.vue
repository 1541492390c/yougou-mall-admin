<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Banner } from '@/interface/platform'
import { getBannerPagesApi } from '@/api/platform/banner-api'

const tableData = ref<Array<Banner>>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)

onMounted(() => {
	getTableData(currentPage.value)
})

// 获取轮播图分页信息
const getTableData = (pageNum: number): void => {
	getBannerPagesApi(pageNum).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const handleCurrentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData(value)
}
</script>

<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='轮播图' align='center'>
				<template #default='scope'>
					<img :src='scope.row.img' alt='' class='banner-img'>
				</template>
			</el-table-column>
			<el-table-column label='所属页面' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.page' placeholder='请输入所属页面' />
				</template>
			</el-table-column>
			<el-table-column label='所属页面' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.description' placeholder='请输入简介(选填)' type='textarea' />
				</template>
			</el-table-column>
			<el-table-column label='链接' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.link' placeholder='请输入轮播图链接(选填)' />
				</template>
			</el-table-column>
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button type='info' text class='button'>编辑</el-button>
					<el-button type='primary' text class='button'>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class='pagination'>
			<el-pagination :page-size='5' :current-page='currentPage' :total='total' layout='prev, pager, next' background
										 small @current-change='handleCurrentPageChange' />
		</div>
	</div>
</template>

<style scoped lang='scss'>
.banner-img {
	width: 250px;
	height: 80px;
	border: silver solid 1px;
}
</style>