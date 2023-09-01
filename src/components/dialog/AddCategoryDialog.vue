<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'

const props = defineProps<{ show: boolean, level: number, parentId: number }>()
const emits = defineEmits<{ (e: 'closeAddCategoryDialog'): void }>()
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

const validateName = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入分类名称'))
	}
	callback()
}

const rules = reactive({
	name: [{validator: validateName, trigger: 'blur'}]
})
</script>

<template>
	<div>
		<el-dialog v-model='showDialog' :center='true' @close='closeDialog' style='width: 600px' title='添加分类'>
			<el-form ref='formRef' :model='formData' :rules='rules'>
				<el-form-item label='分类名称' prop='name'>
					<el-input v-model='formData.name' placeholder='请输入分类名称' />
				</el-form-item>
				<el-form-item>
					<div class='add-button'>
						<el-button type='primary'>确认增加</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<style scoped lang='scss'>
.add-button {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>