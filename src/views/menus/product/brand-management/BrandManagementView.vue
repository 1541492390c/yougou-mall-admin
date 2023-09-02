<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Brand, Category } from '@/interface/product'
import { getBrandPagesApi, updateBrandApi } from '@/api/product/brand-api'
import Pagination from '@/components/pagination/Pagination.vue'
import { BrandTable } from '@/interface/extension'
import { getCategoryListApi } from '@/api/product/category-api'
import { ElMessage } from 'element-plus'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const tableData = ref<Array<BrandTable>>([])
const categoryList = ref<Array<Category>>([])

onMounted(() => {
	getTableData()
	getCategoryList()
})

const getTableData = (): void => {
	getBrandPagesApi(currentPage.value).then((res) => {
		if (res) {
			total.value = res.data.total
			tableData.value = []

			res.data.list.forEach((item: Brand) => {
				// 创建品牌展示数据
				let data: BrandTable = {
					...item,
					options: []
				}
				data.options = item.categoryNode.split('-').map(Number)
				tableData.value.push(data)
			})
		}
	}).catch((err) => {
		console.log(err)
	})
}

const getCategoryList = (): void => {
	getCategoryListApi().then((res) => {
		categoryList.value = res.data
	}).catch((err) => {
		console.log(err)
	})
}

const handleSelect = (value: Array<number>, item: BrandTable): void => {
	item.options = value
	item.categoryNode = value.join('-')
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData()
}

// 更新品牌信息
const updateBrand = (item: BrandTable): void => {
	let data: Brand = {...item}
	updateBrandApi(data).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--图片-->
			<el-table-column label='图片' align='center'>
				<template #default='scope'>
					<img :src='scope.row.img' alt='' class='brand-img'>
				</template>
			</el-table-column>
			<!--分类-->
			<el-table-column label='分类' align='center' prop='categoryNode'>
				<template #default='scope'>
					<el-cascader :model-value='scope.row.options' :options='categoryList'
											 @change='(value: Array<number>) => handleSelect(value, scope.row)'
											 :props="{value: 'categoryId', label: 'name'}" placeholder='请选择' />
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
					<el-input v-model='scope.row.description' placeholder='请输入品牌简介' type='textarea' />
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateBrand(scope.row)' type='info' link>编辑</el-button>
					<el-button type='danger' link>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
	</div>
</template>

<style scoped lang='scss'>
.brand-img {
	width: 80px;
	height: 80px;
	border: silver solid 1px;
}
</style>