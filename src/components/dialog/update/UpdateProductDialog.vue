<script setup lang='ts'>
import { computed } from 'vue'

const props = defineProps<{ show: boolean, productId: number }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()

const showDialog = computed(() => {
	return props.show
})

const closeDialog = (): void => {
	emits('closeDialog')
}
</script>

<template>
	<el-dialog v-model='showDialog' title='商品详细信息' center @close='closeDialog'>
	</el-dialog>
</template>

<style scoped lang='scss'>

</style>