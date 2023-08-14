<template>
	<div class='card'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='商品名称' align='center' prop='name' />
			<el-table-column label='分类节点' align='center' prop='categoryNode' />
			<el-table-column label='商品图片' align='center'>
				<template #default='scope'>
					<img :src='scope.row.cover' alt='' class='product-img'>
				</template>
			</el-table-column>
			<el-table-column label='是否折扣' align='center'>
				<template #default='scope'>
					<span>{{transformBoolean(scope.row.isDiscount)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='是否推荐' align='center'>
				<template #default='scope'>
					<span>{{transformBoolean(scope.row.recommended)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='openUpdateProductDialog(scope.row.productId)' type='info' text class='button'>
						编辑
					</el-button>
					<el-button type='primary' text class='button'>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class='pagination'>
			<el-pagination :page-size='10' :current-page='currentPage' :total='total' layout='prev, pager, next' background
										 small @current-change='handleCurrentPageChange' />
		</div>

		<update-product-dialog :show='showUpdateProductDialog' :product-id='currentProductId'
													 @close-dialog='closeUpdateProductDialog' />
	</div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { getProductPagesApi } from '@/api/product/product-api'
import { Product } from '@/interface/product'
import UpdateProductDialog from '@/components/dialog/UpdateProductDialog.vue'

const tableData = ref<Array<Product>>([])
const total = ref<number>(0)
const showUpdateProductDialog = ref<boolean>(false)
const currentProductId = ref<string>('')
const currentPage = ref<number>(1)

onMounted(() => {
	getTableData(1)
})

const getTableData = (pageNum: number): void => {
	getProductPagesApi(pageNum, 10, undefined, undefined, undefined).then((res) => {
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

// 解析布尔值
const transformBoolean = computed(() => (value: boolean) => {
	return value ? '是' : '否'
})

const openUpdateProductDialog = (value: string): void => {
	showUpdateProductDialog.value = true
	currentProductId.value = value
}

const closeUpdateProductDialog = (): void => {
	showUpdateProductDialog.value = false
}
</script>

<style scoped lang='scss'>
.product-img {
	width: 80px;
	height: 80px;
	border: silver solid 1px;
}

.button {
	font-size: 12px;
}
</style>