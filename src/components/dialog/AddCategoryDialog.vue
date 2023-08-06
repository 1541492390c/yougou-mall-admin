<template>
	<div>
		<el-dialog v-model='showDialog' :center='true' @close='closeDialog' style='width: 600px' title='添加分类'>
			<el-form ref='formRef' :model='formData'>
				<el-form-item label='分类名称' prop='name'>
					<el-input v-model='formData.name' placeholder='请输入分类名称' />
				</el-form-item>
				<el-form-item label='分类级别' prop='level'>
					<el-radio-group v-model='formData.level'>
						<el-radio :label='1'>一级分类</el-radio>
						<el-radio :label='2'>二级分类</el-radio>
						<el-radio :label='3'>三级分类</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label='分类路径'>

				</el-form-item>
				<el-form-item>
					<el-button type='primary'>确认增加</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'

const props = defineProps<{ show: boolean, level: number }>()
const emits = defineEmits<{(e: 'closeAddCategoryDialog'): void}>()
const formRef = ref<FormInstance>()
const formData = reactive({
		name: '',
		level: 1,
		parentId: 0
})

const showDialog = computed(() => {
    return props.show
})

const closeDialog = (): void => {
    emits('closeAddCategoryDialog')
}
</script>

<style scoped lang='scss'>

</style>