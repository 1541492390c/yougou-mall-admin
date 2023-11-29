<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue'
import { Order } from '@/interface/order'
import { getOrderPagesApi, updateOrderStateApi } from '@/api/order/order-api'
import Pagination from '@/components/pagination/Pagination.vue'
import { ElMessage, FormInstance } from 'element-plus'

const isSearch = ref<boolean>(false)
const searchForm = ref<FormInstance>()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(5)
const tableData = ref<Array<Order>>([])
const orderStateOptions = ref<Array<any>>([
	{value: undefined, label: '全部'},
	{value: 0, label: '已取消'},
	{value: 1, label: '待付款'},
	{value: 2, label: '待发货'},
	{value: 3, label: '配送中'},
	{value: 4, label: '已完成'},
])
const searchData = reactive<Record<string, any>>({
	orderNo: '',
	state: undefined
})

onMounted(() => {
	getTableData()
})

// 解析规格
const transformSpecs = computed(() => (value: string): string => {
	let object = JSON.parse(value)
	let specs: string = ''
	for (let index in object) {
		specs += object[index] + ' , '
	}
	return specs.substring(0, specs.length - 2)
})

// 解析订单状态
const transformOrderState = computed(() => (value: number): string => {
	switch (value) {
		case 0:
			return '已取消'
		case 1:
			return '待付款'
		case 2:
			return '待发货'
		case 3:
			return '配送中'
		case 4:
			return '已完成'
		default:
			return '--'
	}
})

// 获取表格信息
const getTableData = (): void => {
	getOrderPagesApi(currentPage.value, currentSize.value).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const search = (): void => {
	getOrderPagesApi(currentPage.value, currentSize.value, searchData.state, searchData.orderNo).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const handleSearch = (): void => {
	isSearch.value = true
	currentPage.value = 1
	search()
}

// 重置
const handleReset = (): void => {
	isSearch.value = false
	currentPage.value = 1
	searchForm.value?.resetFields()
	getTableData()
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	isSearch.value ? search() : getTableData()
}

// 更新订单状态
const updateOrderState = (orderId: number, index: number): void => {
	console.log(orderId)
	updateOrderStateApi(orderId, 3).then((res) => {
		if (res) {
			ElMessage.success('发货成功')
			// 更新表格数据
			for (let i in tableData.value) {
				if (parseInt(i) === index) {
					tableData.value[i].state = 3
				}
			}
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<template>
	<div class='card'>
		<!--搜索栏-->
		<el-form ref='searchForm' :model='searchData' inline class='search-form'>
			<!--订单号-->
			<el-form-item label='订单号:' prop='orderNo'>
				<el-input v-model='searchData.orderNo' placeholder='请输入订单号' />
			</el-form-item>
			<!--订单状态-->
			<el-form-item label='订单状态:' prop='state'>
				<el-select v-model='searchData.state' placeholder='请选择订单状态'>
					<el-option v-for='(item, index) in orderStateOptions' :value='item.value' :label='item.label' :key='index' />
				</el-select>
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
			<el-table-column label='订单号' align='center' prop='orderNo' width='200' />
			<el-table-column label='订单详情' align='center' width='500'>
				<template #default='scope'>
					<div v-for='(item, index) in scope.row.orderItemList' :key='index' class='order-items'>
						<!--商品图片-->
						<div style='width: 10%'>
							<img :src=item.img alt='' class='order-item-img' />
						</div>
						<!--商品名称-->
						<div class='product-name'>
							<span>{{item.productName}}</span>
						</div>
						<!--商品规格-->
						<div class='specs'>
							<span>{{transformSpecs(item.specs)}}</span>
						</div>
						<!--购买数量-->
						<div class='quantity'>
							<span>x {{item.quantity}}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label='金额' align='center'>
				<template #default='scope'>
					<span>{{scope.row.totalAmount.toFixed(2)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='时间' align='center' width='250'>
				<template #default='scope'>
					<div class='time'>
						<div v-if='scope.row.submitTime'>下单时间: {{scope.row.submitTime}}</div>
						<div v-if='scope.row.payTime'>支付时间: {{scope.row.payTime}}</div>
						<div v-if='scope.row.deliveryTime'>配送时间: {{scope.row.deliveryTime}}</div>
						<div v-if='scope.row.finishTime'>完成时间: {{scope.row.finishTime}}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label='订单状态' align='center'>
				<template #default='scope'>
					<span style='font-size: 12px'>{{transformOrderState(scope.row.state)}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button v-if='scope.row.state === 0' type='info' link disabled>订单已取消</el-button>
					<el-button @click='updateOrderState(scope.row.orderId, scope.$index)' v-if='scope.row.state === 2' type='danger' link>发货</el-button>
					<el-button v-if='scope.row.state === 3' type='info' link disabled>已发货,待客户接收</el-button>
					<el-button v-if='scope.row.state === 4' type='success' link disabled>该订单已完成</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
	</div>
</template>

<style scoped lang='scss'>
.order-items {
	display: flex;
	flex-direction: row;
	align-items: center;
	word-wrap: break-word;
	word-break: break-word;

	div {
		margin-left: 30px;
		margin-top: 5px;
		margin-bottom: 5px;
	}
}

.order-item-img {
	width: 45px;
	height: 45px;
	border: silver solid 1px;
}

.product-name {
	width: 40%;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	font-size: 12px;
}


.specs {
	width: 25%;
	font-size: 10px;
	color: gray;
}

.quantity {
	width: 15%;
	font-size: 10px;
	color: gray;
}

.time {
	font-size: 12px;
	letter-spacing: 1px;

	div {
		margin-top: 5px;
	}
}
</style>