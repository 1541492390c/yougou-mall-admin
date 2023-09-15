<script setup lang='ts'>
import { computed, ref } from 'vue'
import { getSkuPagesApi, updateSkuApi } from '@/api/product/sku-api'
import { Sku } from '@/interface/product'
import Pagination from '@/components/pagination/Pagination.vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ show: boolean, productId: number }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(5)
const tableData = ref<Array<Sku>>([])

const showDialog = computed(() => {
	return props.show
})

const getTableData = (): void => {
	getSkuPagesApi(props.productId, currentPage.value, currentSize.value).then((res) => {
		if (res) {
			total.value = res.data.total
			tableData.value = res.data.list
		}
	}).catch((err) => {
		console.log(err)
	})
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData()
}

const updateSku = (value: Sku): void => {
	updateSkuApi(value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
		}
	}).catch((err) => {
		console.log(err)
	})
}

const openDialog = (): void => {
	getTableData()
}

const closeDialog = (): void => {
	emits('closeDialog')
}
</script>

<template>
	<el-dialog v-model='showDialog' title='商品规格详细' center @open='openDialog' @close='closeDialog' width='1200'>
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--价格-->
			<el-table-column label='价格' prop='price' align='center'>
				<template #default='scope'>
					<el-input-number v-model='scope.row.price' placeholder='请输入价格' />
				</template>
			</el-table-column>
			<!--价格-->
			<el-table-column label='库存' prop='skuStock' align='center'>
				<template #default='scope'>
					<el-input-number v-model='scope.row.skuStock' placeholder='请输入库存' />
				</template>
			</el-table-column>
			<!--简介-->
			<el-table-column label='简介' prop='description' align='center' width='400'>
				<template #default='scope'>
					<el-input v-model='scope.row.description' placeholder='请输入简介' />
				</template>
			</el-table-column>
			<!--规格-->
			<el-table-column label='规格' prop='specs' align='center' />
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateSku(scope.row)' type='info' link>编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :current='currentPage' :size='currentSize' @current-change='currentPageChange' />
	</el-dialog>
</template>

<style scoped lang='scss'>

</style>