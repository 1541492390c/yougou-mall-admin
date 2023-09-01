<script setup lang='ts'>

</script>

<template>
	<div class='card'>
		<el-table>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='反馈类型' prop='feedbackTypeName' align='center' />
			<el-table-column label='联系方式(电话/邮箱)' prop='contactWay' align='center' />
			<el-table-column label='操作' align='center' />
		</el-table>
	</div>
</template>

<style scoped lang='scss'>

</style>