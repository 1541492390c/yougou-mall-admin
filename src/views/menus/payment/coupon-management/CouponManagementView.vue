<script setup lang='ts'>
import { ref } from 'vue'

const total = ref<number>(0)
const currentPage = ref<number>(1)

const currentPageChange = (value: number): void => {
	console.log(value)
}
</script>

<template>
	<div class='card'>
		<el-table>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
		</el-table>
		<div class='pagination'>
			<el-pagination :total='total' :page-size='10' :current-page='currentPage' @current-change='currentPageChange'
										 small layout='prev, pager, next' background />
		</div>
	</div>
</template>

<style scoped lang='scss'></style>