<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Brand } from '@/interface/product'
import { getBrandPagesApi } from '@/api/product/brand-api'

const tableData = ref<Array<Brand>>()
const total = ref<number>()
const currentPage = ref<number>(1)

onMounted(() => {
    getTableData()
})

const getTableData = () => {
	getBrandPagesApi(currentPage.value).then((res) => {
		if (res) {
			total.value = res.data.data.total
			tableData.value = res.data.data.list
		}
	}).catch((err) => {
		console.log(err)
	})
}

const handleCurrentPageChange = (value: number): void => {
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
			<!--id-->
			<el-table-column label='ID' prop='brandId' align='center' />
			<!--图片-->
			<el-table-column label='图片' align='center'>
				<template #default='scope'>
					<img :src='scope.row.img' alt='' class='brand-img'>
				</template>
			</el-table-column>
			<!--名称-->
			<el-table-column label='名称' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.name' placeholder='请输入品牌名称' />
				</template>
			</el-table-column>
			<!--简介-->
			<el-table-column label='简介' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.description' placeholder='请输入品牌简介' />
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center' />
		</el-table>
		<div class='pagination'>
			<el-pagination :page-size='10' :current-page='currentPage' :total='total'
										 small background layout='prev, pager, next' @current-change='handleCurrentPageChange' />
		</div>
	</div>
</template>

<style scoped lang='scss'>
.brand-img {
	width: 80px;
	height: 80px;
	border: silver solid 1px;
}
</style>