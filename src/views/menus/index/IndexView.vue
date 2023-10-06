<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Box, User, Van } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { EChartsType } from 'echarts'
import { ECBasicOption, EChartsOption } from 'echarts/types/dist/shared'
import { getProductCountApi } from '@/api/product/product-api'
import { getUserCountApi, getUserStatisticsApi } from '@/api/user/user-api'
import { getOrderCountApi, getOrderStatisticsApi } from '@/api/order/order-api'
import { OrderStatistics, UserStatistics } from '@/interface/extension'

const productTotal = ref<number>(0)
const userTotal = ref<number>(0)
const orderTotal = ref<number>(0)
const orderNumChartRef = ref<HTMLElement>()
const orderAmountChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()
const monthList = ref<Array<string>>(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'])

onMounted(() => {
	getProductTotal()
	getUserTotal()
	getOrderTotal()
	initOrderCharts()
	initUserChart()
})

const getProductTotal = (): void => {
	getProductCountApi().then((res) => {
		if (res) {
			productTotal.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}

const getUserTotal = (): void => {
	getUserCountApi().then((res) => {
		if (res) {
			userTotal.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}

const getOrderTotal = (): void => {
	getOrderCountApi().then((res) => {
		if (res) {
			orderTotal.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}

const initOrderCharts = (): void => {
	getOrderStatisticsApi().then((res) => {
		if (res) {
			// 初始化订单数量统计表单
			initOrderNumChart(res.data)
			// 初始化订单金额统计表单
			initOrderAmountChart(res.data)
		}
	}).catch((err) => {
		console.log(err)
	})
}

const initOrderNumChart = (res: Array<OrderStatistics>): void => {
	let orderNumChart: EChartsType = echarts.init(orderNumChartRef.value)
	let data: Array<number> = []
	let monthDataMap: Map<string, number> = new Map<string, number>()
	res.forEach((item: OrderStatistics) => {
		monthDataMap.set(item.month, item.total)
	})
	monthList.value.forEach((item: string) => {
		!monthDataMap.has(item) ? data.push(0) : data.push(monthDataMap.get(item) as number)
	})
	let series: any = [{name: '数量', type: 'line', data: data}]
	// 订单数量统计表单
	let orderNumOption: EChartsOption = {
		color: '#f13a3a',
		title: {
			text: '订单数量统计'
		},
		tooltip: {},
		legend: {
			data: ['数量']
		},
		xAxis: {data: monthList.value},
		yAxis: {},
		series: series
	}
	orderNumChart.setOption(orderNumOption)
}

const initOrderAmountChart = (res: Array<OrderStatistics>): void => {
	let orderAmountChart: EChartsType = echarts.init(orderAmountChartRef.value)
	let data: Array<number> = []
	let monthDataMap: Map<string, number> = new Map<string, number>()
	res.forEach((item: OrderStatistics) => {
		monthDataMap.set(item.month, item.totalAmount)
	})
	monthList.value.forEach((item: string) => {
		!monthDataMap.has(item) ? data.push(0) : data.push(monthDataMap.get(item) as number)
	})
	let series: any = [{name: '金额', type: 'line', data: data}]
	// 订单数量统计表单
	let orderNumOption: EChartsOption = {
		color: '#f13a3a',
		title: {
			text: '订单金额统计'
		},
		tooltip: {},
		legend: {
			data: ['金额']
		},
		xAxis: {data: monthList.value},
		yAxis: {},
		series: series
	}
	orderAmountChart.setOption(orderNumOption)
}

const initUserChart = (): void => {
	getUserStatisticsApi().then((res) => {
		if (res) {
			console.log(res.data)
			let eChart: EChartsType = echarts.init(userChartRef.value)
			let data: Array<number> = []
			let monthDataMap: Map<string, number> = new Map<string, number>()
			res.data.forEach((item: UserStatistics) => {
				monthDataMap.set(item.month, item.total)
			})
			monthList.value.forEach((item: string) => {
				!monthDataMap.has(item) ? data.push(0) : data.push(monthDataMap.get(item) as number)
			})
			let series: any = [{name: '数量', type: 'line', data: data}]
			let option: ECBasicOption = {
				color: '#f13a3a',
				title: {
					text: '用户数量增长统计'
				},
				tooltip: {},
				legend: {
					data: ['数量']
				},
				xAxis: {data: monthList.value},
				yAxis: {},
				series: series
			}
			eChart.setOption(option)
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<template>
	<div>
		<div class='card' style='margin-bottom: 20px'>
			<div class='title'>
				<span>基本信息</span>
			</div>
			<div class='total-card-list'>
				<!--商品总数-->
				<div class='total-card-container'>
					<div class='total-card'>
						<el-icon :size='60'>
							<Box />
						</el-icon>
						<span class='info'>商品总数: {{productTotal}}</span>
					</div>
				</div>
				<!--用户总数-->
				<div class='total-card-container'>
					<div class='total-card'>
						<el-icon :size='60'>
							<User />
						</el-icon>
						<span class='info'>用户总数: {{userTotal}}</span>
					</div>
				</div>
				<!--商品总数-->
				<div class='total-card-container'>
					<div class='total-card'>
						<el-icon :size='60'>
							<Van />
						</el-icon>
						<span class='info'>订单总数: {{orderTotal}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class='card'>
			<div class='title'>
				<span>统计表单</span>
			</div>
			<!--订单相关统计图表-->
			<div class='order-charts-list'>
				<!--订单数量图表-->
				<div ref='orderNumChartRef' class='order-chart' />
				<!--订单金额图表-->
				<div ref='orderAmountChartRef' class='order-chart' />
			</div>
			<!--用户相关统计图表-->
			<div ref='userChartRef' class='user-chart' />
		</div>
	</div>
</template>

<style scoped lang='scss'>
.title {
	margin-left: 10px;
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: 16px;
	font-weight: bold;
}

.total-card-list {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.total-card-container {
	width: 33.3%;
	padding: 10px;
	display: flex;
	flex-direction: row;
	justify-content: center;

	&:first-child {
		color: #f13a3a;
	}

	&:nth-child(2) {
		color: #E6A23C;
	}

	&:last-child {
		color: #67C23A;
	}

	.info {
		margin-left: 10px;
		font-weight: bold;
	}
}

.total-card {
	height: 150px;
	width: 100%;
	padding: 10px;
	font-size: 20px;
	border: #CDD0D6 solid 1px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:hover {
		border: #f13a3a solid 1px;
	}
}

.order-charts-list {
	display: flex;
	flex-direction: row;
}

.order-chart {
	width: 50%;
	height: 400px;
	margin: 10px;
	padding: 10px;
	border: #CDD0D6 solid 1px;
}

.user-chart {
	height: 400px;
	margin: 10px;
	padding: 10px;
	border: #CDD0D6 solid 1px;
}
</style>