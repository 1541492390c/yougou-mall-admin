<script setup lang='ts'>
import { computed, ref } from 'vue'
import { Product } from '@/interface/product'
import { updateProductApi } from '@/api/product/product-api'
import { ElMessage } from 'element-plus'

const props = defineProps<{ show: boolean, currentCover: string, imgList: Array<string>, product: Product | undefined }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()
const activeCover = ref<string>('')

const showDialog = computed(() => {
	return props.show
})

const openDialog = (): void => {
	activeCover.value = props.currentCover
}

// 选择封面
const handleSelect = (value: string): void => {
	activeCover.value = value
}

const closeDialog = (): void => {
	emits('closeDialog')
}

// 更新商品封面
const updateCover = (): void => {
	let value: Product = {...props.product} as Product
	value.cover = activeCover.value
	updateProductApi(value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
			closeDialog()
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<template>
	<el-dialog v-model='showDialog' :center='true' @open='openDialog' @close='closeDialog' title='商品封面'>
		<div class='product-img-container'>
			<div v-for='(item, index) in imgList' :key='index'>
				<img @click='handleSelect(item)' :src='item' alt=''
						 :class="activeCover === item ? 'product-img-active' : 'product-img'" />
			</div>
		</div>
		<div class='bottom'>
			<el-button @click='updateCover' type='primary'>确定</el-button>
		</div>
	</el-dialog>
</template>

<style scoped lang='scss'>
.product-img-container {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
}

.product-img {
	width: 180px;
	height: 180px;
	border: silver solid 3px;

	&:hover {
		border: #f13a3a solid 3px;
		cursor: pointer;
	}
}

.product-img-active {
	@extend .product-img;
	border: #f13a3a solid 3px;
}

.bottom {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 20px;
}
</style>