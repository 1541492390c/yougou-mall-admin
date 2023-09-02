<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { getProductPagesApi, updateProductApi } from '@/api/product/product-api'
import { Category, Product } from '@/interface/product'
import UpdateProductDialog from '@/components/dialog/UpdateProductDialog.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { getCategoryListApi } from '@/api/product/category-api'
import { ProductTable } from '@/interface/extension'
import { ElMessage } from 'element-plus'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(5)
const currentProductId = ref<string>('')
const showUpdateProductDialog = ref<boolean>(false)
const tableData = ref<Array<ProductTable>>([])
const categoryList = ref<Array<Category>>([])

onMounted(() => {
	getTableData()
	getCategoryList()
})

const getTableData = (): void => {
	getProductPagesApi(currentPage.value, currentSize.value, undefined, undefined, undefined).then((res) => {
		if (res) {
			total.value = res.data.total
			tableData.value = []

			res.data.list.forEach((item: Product) => {
				// 创建商品展示数据
				let data: ProductTable = {
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

const handleSelect = (value: Array<number>, item: ProductTable): void => {
	item.options = value
	item.categoryNode = value.join('-')
}

const handleDiscountChange = (value: boolean, item: ProductTable): void => {
	item.isDiscount = value
	value ? item.discount = 9 : item.discount = undefined
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData()
}

const openUpdateProductDialog = (value: string): void => {
	showUpdateProductDialog.value = true
	currentProductId.value = value
}

const closeUpdateProductDialog = (): void => {
	showUpdateProductDialog.value = false
}

// 更新商品信息
const updateProduct = (value: ProductTable): void => {
	let data: Product = {...value}
	updateProductApi(data).then((res) => {
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
			<!--商品名称-->
			<el-table-column label='商品名称' align='center' width='300'>
				<template #default='scope'>
					<el-input v-model='scope.row.name' placeholder='请输入商品名称' />
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
			<!--商品图片-->
			<el-table-column label='商品图片' align='center'>
				<template #default='scope'>
					<img :src='scope.row.cover' alt='' class='product-img'>
				</template>
			</el-table-column>
			<!--是否折扣-->
			<el-table-column label='是否折扣' align='center' width='200'>
				<template #default='scope'>
					<el-switch v-model='scope.row.isDiscount' @change='(value: boolean) => handleDiscountChange(value, scope.row)' />
				</template>
			</el-table-column>
			<!--折扣率-->
			<el-table-column label='折扣率' align='center'>
				<template #default='scope'>
					<el-input-number :disabled='!scope.row.isDiscount' v-model='scope.row.discount' :min='1' :max='9'
													 :placeholder="scope.row.isDiscount ? '请输入折扣率' : '暂无折扣'" />
				</template>
			</el-table-column>
			<!--是否推荐-->
			<el-table-column label='是否推荐' align='center'>
				<template #default='scope'>
					<el-switch v-model='scope.row.recommended' />
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateProduct(scope.row)' type='info' link>编辑</el-button>
					<el-button @click='openUpdateProductDialog(scope.row.productId)' type='info' link>详情</el-button>
					<el-button type='primary' link>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
		<!--更新商品对话框-->
		<update-product-dialog :show='showUpdateProductDialog' :product-id='currentProductId'
													 @close-dialog='closeUpdateProductDialog' />
	</div>
</template>

<style scoped lang='scss'>
.product-img {
	width: 80px;
	height: 80px;
	border: silver solid 1px;
}
</style>