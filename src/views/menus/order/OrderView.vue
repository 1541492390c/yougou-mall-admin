<template>
	<div class='card'>
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
					<el-button v-if='scope.row.state === 2' type='primary' text class='button'>发货</el-button>
					<el-button v-if='scope.row.state === 4' type='success' text disabled class='button'>该订单已完成</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { Order } from '@/interface/order'
import { getOrderPagesApi } from '@/api/order/order-api'

const tableData = ref<Array<Order>>([])
const total = ref<number>(0)

onMounted(() => {
	getTableData()
})

// 获取表格信息
const getTableData = (): void => {
	getOrderPagesApi().then((res) => {
		if (res) {
			console.log(res)
			tableData.value = res.data.list
			total.value = res.data.total
		}
	})
}

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
</script>

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

.button {
	font-size: 12px;
}
</style>