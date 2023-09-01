<script setup lang='ts'>
import { computed } from 'vue'

const props = defineProps<{show: boolean, productId: string}>()
const emits = defineEmits<{ (e: 'closeDialog'): void}>()

const showDialog = computed(() => {
	return props.show
})

const closeDialog = (): void => {
	emits('closeDialog')
}
</script>

<template>
	<el-dialog v-model='showDialog' title='编辑商品信息' center @close='closeDialog'>
	</el-dialog>
</template>

<style scoped lang='scss'>

</style>