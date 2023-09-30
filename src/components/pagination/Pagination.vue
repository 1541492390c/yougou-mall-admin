<script setup lang='ts'>
const props = defineProps<{ total: number, current: number, size: number }>()
const emits = defineEmits<{ (e: 'currentChange', current: number): void }>()

// 当前页面改变
const currentChange = (value: number): void => {
	emits('currentChange', value)
}
</script>

<template>
	<div class='pagination'>
		<el-pagination :total='props.total' :page-size='props.size' :current-page='props.current'
									 @current-change='currentChange' small layout='prev, pager, next' background />
	</div>
</template>