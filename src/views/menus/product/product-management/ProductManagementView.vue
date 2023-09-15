<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { deleteProductApi, getProductPagesApi, updateProductApi } from '@/api/product/product-api'
import { Product } from '@/interface/product'
import ProductSkuDetailDialog from '@/components/dialog/detail/ProductSkuDetailDialog.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { ProductTable } from '@/interface/extension'
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultImage from '@/assets/img/default-image.png'
import UpdateProductCoverDialog from '@/components/dialog/update/UpdateProductCoverDialog.vue'
import { useStore } from 'vuex'

const store = useStore()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(5)
const currentProductId = ref<number>(0)
const currentCover = ref<string>('')
const showUpdateProductDialog = ref<boolean>(false)
const shopUpdateCoverDialog = ref<boolean>(false)
const currentImgList = ref<Array<string>>([])
const tableData = ref<Array<ProductTable>>([])
const searchData = reactive<Record<string, any>>({
	categoryNode: '',
	name: '',
	isDiscount: undefined,
	recommended: undefined,
	searchOptions: []
})

onMounted(() => {
	getTableData()
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

const openProductSkuDialog = (value: number): void => {
	showUpdateProductDialog.value = true
	currentProductId.value = value
}

const closeUpdateProductDialog = (): void => {
	showUpdateProductDialog.value = false
}

const openUpdateCoverDialog = (value: number): void => {
	currentProductId.value = value
	tableData.value.forEach((item: ProductTable) => {
		if (item.productId === value) {
			currentImgList.value = JSON.parse(item.imgList as string)
			currentCover.value = item.cover
			shopUpdateCoverDialog.value = true
			return
		}
	})
}

const closeUpdateCoverDialog = (): void => {
	shopUpdateCoverDialog.value = false
	currentProductId.value = 0
	currentCover.value = ''
	currentImgList.value = []
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

// 删除商品信息
const deleteProduct = (value: number, index: number): void => {
	ElMessageBox.confirm('此操作将删除商品,是否继续?', '删除商品').then(() => {
		deleteProductApi(value).then((res) => {
			if (res) {
				ElMessage.success('删除成功')
				tableData.value.splice(index, 1)
			}
		}).catch((err) => {
			console.log(err)
		})
	})
}
</script>

<template>
	<div class='card'>
		<!--搜索栏-->
		<el-form :model='searchData' inline class='search-form'>
			<!--分类-->
			<el-form-item label='分类:'>
				<el-cascader :model-value='searchData.searchoptions' :options='store.getters.categoryList'
										 :props="{value: 'categoryId', label: 'name'}" placeholder='请选择' style='width: 280px' />
			</el-form-item>
			<!--商品名称-->
			<el-form-item label='商品名称:'>
				<el-input v-model='searchData.name' placeholder='请输入商品名称' />
			</el-form-item>
			<!--是否折扣-->
			<el-form-item label='是否折扣:'>
				<el-switch v-model='searchData.isDiscount' />
			</el-form-item>
			<!--是否推荐-->
			<el-form-item label='是否推荐:'>
				<el-switch v-model='searchData.recommended' />
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
			<!--商品名称-->
			<el-table-column label='商品名称' align='center' width='300'>
				<template #default='scope'>
					<el-input v-model='scope.row.name' placeholder='请输入商品名称' />
				</template>
			</el-table-column>
			<!--分类-->
			<el-table-column label='分类' align='center' prop='categoryNode'>
				<template #default='scope'>
					<el-cascader :model-value='scope.row.options' :options='store.getters.categoryList'
											 @change='(value: Array<number>) => handleSelect(value, scope.row)'
											 :props="{value: 'categoryId', label: 'name'}" placeholder='请选择' />
				</template>
			</el-table-column>
			<!--商品图片-->
			<el-table-column label='商品封面' align='center'>
				<template #default='scope'>
					<img :src='scope.row.cover ? scope.row.cover : defaultImage'
							 @click='openUpdateCoverDialog(scope.row.productId)' alt='' class='product-img'>
				</template>
			</el-table-column>
			<!--是否折扣-->
			<el-table-column label='是否折扣' align='center' width='200'>
				<template #default='scope'>
					<el-switch v-model='scope.row.isDiscount'
										 @change='(value: boolean) => handleDiscountChange(value, scope.row)' />
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
					<el-button @click='openProductSkuDialog(scope.row.productId)' type='info' link>规格详情</el-button>
					<el-button @click='deleteProduct(scope.row.productId, scope.$index)' type='primary' link>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
		<!--商品规格对话框-->
		<product-sku-detail-dialog :show='showUpdateProductDialog' :product-id='currentProductId'
															 @close-dialog='closeUpdateProductDialog' />
		<!--更新商品封面对话框-->
		<update-product-cover-dialog :product-id='currentProductId' :show='shopUpdateCoverDialog'
																 :current-cover='currentCover' :img-list='currentImgList'
																 @close-dialog='closeUpdateCoverDialog' />
	</div>
</template>

<style scoped lang='scss'>
.product-img {
	width: 80px;
	height: 80px;
	border: silver solid 1px;

	&:hover {
		border: #f13a3a solid 1px;
		cursor: pointer;
	}
}
</style>