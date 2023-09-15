<script setup lang='ts'>
import { computed, ref } from 'vue'
import { Feedback } from '@/interface/user'

const props = defineProps<{ show: boolean, feedback: Feedback | undefined }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()
const imgList = ref<Array<string>>([])

const showDialog = computed(() => {
	return props.show
})


const openDialog = (): void => {
	if (!!props.feedback?.imgList) {
		imgList.value = JSON.parse(props.feedback?.imgList)
	}
}

const closeDialog = (): void => {
	emits('closeDialog')
}
</script>

<template>
	<el-dialog v-model='showDialog' title='反馈详情' @open='openDialog' @close='closeDialog' center>
		<div v-html='props.feedback?.content'></div>
		<div class='img-list-container'>
			<img v-if='imgList.length !== 0' v-for='(item, index) in imgList' :src='item' :key='index' alt='' />
			<span v-else>暂未上传图片</span>
		</div>
	</el-dialog>
</template>

<style scoped lang='scss'>
.img-list-container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	img {
		width: 65px;
		height: 65px;
		border: silver solid 1px;
		margin-right: 10px;
	}
}
</style>