<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { Brand } from '@/interface/product'
import { deleteBrandApi, getBrandPagesApi, updateBrandApi } from '@/api/product/brand-api'
import Pagination from '@/components/pagination/Pagination.vue'
import { BrandTable } from '@/interface/extension'
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultImage from '@/assets/img/default-image.png'
import { useStore } from 'vuex'

const store = useStore()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const tableData = ref<Array<BrandTable>>([])
const searchData = reactive<Record<string, any>>({
	categoryNode: '',
	name: '',
	searchOptions: []
})

onMounted(() => {
	getTableData()
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

// 删除品牌
const deleteBrand = (value: number, index: number): void => {
	ElMessageBox.confirm('此操作将删除品牌,是否继续?', '删除品牌').then(() => {
		deleteBrandApi(value).then((res) => {
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
		<!--搜索栏-->
		<el-form :model='searchData' inline class='search-form'>
			<!--分类-->
			<el-form-item label='分类:'>
				<el-cascader :model-value='searchData.searchOptions' :options='store.state.categoryList'
										 :props="{value: 'categoryId', label: 'name'}" placeholder='请选择分类' style='width: 300px' />
			</el-form-item>
			<!--名称-->
			<el-form-item label='名称:'>
				<el-input v-model='searchData.name' placeholder='请输入名称' />
			</el-form-item>
			<el-form-item>
				<el-button>重置</el-button>
				<el-button type='primary'>重置</el-button>
			</el-form-item>
		</el-form>
		<!--表格数据-->
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--图片-->
			<el-table-column label='图片' align='center'>
				<template #default='scope'>
					<img :src='scope.row.img ? scope.row.img : defaultImage' alt='' class='brand-img'>
				</template>
			</el-table-column>
			<!--分类-->
			<el-table-column label='分类' align='center' prop='categoryNode'>
				<template #default='scope'>
					<el-cascader :model-value='scope.row.options' :options='store.state.categoryList'
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
					<el-button @click='deleteBrand(scope.row.brandId, scope.$index)' type='danger' link>删除</el-button>
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