<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { deleteCouponApi, getCouponPagesApi, updateCouponApi } from '@/api/payment/coupon-api'
import { BrandTable, CouponTable } from '@/interface/extension'
import { Coupon } from '@/interface/payment'
import { Category } from '@/interface/product'
import { getCategoryListApi } from '@/api/product/category-api'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'

const isSearch = ref<boolean>(false)
const searchForm = ref<FormInstance>()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const categoryList = ref<Array<Category>>([])
const tableData = ref<Array<CouponTable>>([])
const searchData = reactive<Record<string, any>>({
	categoryNode: '',
	quota: undefined,
	expired: undefined,
	searchOptions: []
})

onMounted(() => {
	getTableData()
	getCategoryList()
})

const getTableData = (): void => {
	getCouponPagesApi(currentPage.value, currentSize.value).then((res) => {
		if (res) {
			total.value = res.data.total
			tableData.value = []

			res.data.list.forEach((item: Coupon) => {
				// 创建品牌展示数据
				let data: CouponTable = {
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

const search = (): void => {
	getCouponPagesApi(currentPage.value, currentSize.value, searchData.quota, searchData.expired, searchData.categoryNode).then((res) => {
		if (res) {
			total.value = res.data.total
			tableData.value = []

			res.data.list.forEach((item: Coupon) => {
				// 创建品牌展示数据
				let data: CouponTable = {
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

		// 通用分类
		let common: Category = {categoryId: 0, parentId: 0, level: 0, name: '通用'}
		categoryList.value.unshift(common)
	}).catch((err) => {
		console.log(err)
	})
}

// 选择分类
const handleSelect = (value: Array<number>, item: BrandTable): void => {
	item.options = value
	item.categoryNode = value.join('-')
}

const handleSelectSearchCategory = (value: Array<number>): void => {
	searchData.categoryNode = value.join('-')
}

// 搜索
const handleSearch = (): void => {
	isSearch.value = true
	currentPage.value = 1
	search()
}

// 重置
const handleReset = (): void => {
	isSearch.value = false
	currentPage.value = 1
	searchData.searchOptions = []
	searchForm.value?.resetFields()
	getTableData()
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	isSearch.value ? search() : getTableData()
}

// 更新优惠券
const updateCoupon = (item: Coupon): void => {
	let data: Coupon = {...item}
	updateCouponApi(data).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 删除优惠券
const deleteCoupon = (value: number, index: number): void => {
	ElMessageBox.confirm('此操作将删除优惠券,是否继续?', '删除优惠券').then(() => {
		deleteCouponApi(value).then((res) => {
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
		<el-form ref='searchForm' :model='searchData' inline class='search-form'>
			<!--分类-->
			<el-form-item label='分类:' prop='categoryNode'>
				<el-cascader :model-value='searchData.searchOptions' :options='categoryList'
										 :props="{value: 'categoryId', label: 'name', checkStrictly: true}"
										 @change='handleSelectSearchCategory' placeholder='请选择分类' style='width: 300px' />
			</el-form-item>
			<!--配额-->
			<el-form-item label='配额:' prop='quota'>
				<el-input-number v-model='searchData.quota' :min='0' placeholder='请输入配额' style='width: 200px' />
			</el-form-item>
			<!--过期天数-->
			<el-form-item label='过期天数:' prop='expired'>
				<el-input-number v-model='searchData.expired' :min='1' :max='10' placeholder='请输入过期天数' style='width: 200px' />
			</el-form-item>
			<el-form-item>
				<el-button @click='handleReset'>重置</el-button>
				<el-button @click='handleSearch' type='primary'>搜索</el-button>
			</el-form-item>
		</el-form>
		<!--表格数据-->
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--配额-->
			<el-table-column label='配额' align='center'>
				<template #default='scope'>
					<el-input-number v-model='scope.row.quota' :min='0' placeholder='请输入配额' />
				</template>
			</el-table-column>
			<!--过期天数-->
			<el-table-column label='过期天数' align='center'>
				<template #default='scope'>
					<el-input-number v-model='scope.row.expired' :min='1' :max='10' placeholder='请输入过期天数' />
				</template>
			</el-table-column>
			<!--分类-->
			<el-table-column label='分类' align='center' width='350'>
				<template #default='scope'>
					<el-cascader :model-value='scope.row.options' :options='categoryList'
											 @change='(value: Array<number>) => handleSelect(value, scope.row)'
											 :props="{value: 'categoryId', label: 'name', checkStrictly: true}" placeholder='请选择'
											 style='width: 300px' />
				</template>
			</el-table-column>
			<!--简介-->
			<el-table-column label='简介' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.description' type='textarea' placeholder='请输入简介' />
				</template>
			</el-table-column>
			<!--今日已领取-->
			<el-table-column label='今日已领取' align='center' prop='takeCount' />
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateCoupon(scope.row)' type='info' link>编辑</el-button>
					<el-button @click='deleteCoupon(scope.row.couponId, scope.$index)' type='danger' link>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :current='currentPage' :size='currentSize' @current-change='currentPageChange' />
	</div>
</template>

<style scoped lang='scss'></style>