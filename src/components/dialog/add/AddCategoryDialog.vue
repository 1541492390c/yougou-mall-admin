<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { saveCategoryApi } from '@/api/product/category-api'
import { Category } from '@/interface/product'

const props = defineProps<{ show: boolean, level: number, parentId: number }>()
const emits = defineEmits<{ (e: 'closeAddCategoryDialog', isAdd: boolean, parentId: number, level: number): void }>()
const formRef = ref<FormInstance>()
const formData = reactive({
	name: ''
})

const showDialog = computed(() => {
	return props.show
})

const closeDialog = (isAdd: boolean): void => {
	formData.name = ''
	emits('closeAddCategoryDialog', isAdd, props.parentId, props.level)
}

const validateName = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入分类名称'))
	}
	callback()
}

// 添加分类
const addCategory = (form: FormInstance | undefined): void => {
	if (!form) {
		return
	}
	form.validate((valid) => {
		if (valid) {
			let value: Category = {
				name: formData.name,
				level: props.level,
				parentId: props.parentId,
				categoryId: 0
			}
			saveCategoryApi(value).then((res) => {
				if (res) {
					ElMessage.success('添加成功')
					closeDialog(true)
				}
			}).catch((err) => {
				console.log(err)
			})
		}
	})
}

const rules = reactive({
	name: [{validator: validateName, trigger: 'blur'}]
})
</script>

<template>
	<div>
		<el-dialog v-model='showDialog' :center='true' @close='closeDialog(false)' style='width: 600px' title='添加分类'>
			<el-form ref='formRef' :model='formData' :rules='rules'>
				<el-form-item label='分类名称' prop='name'>
					<el-input v-model='formData.name' placeholder='请输入分类名称' />
				</el-form-item>
				<el-form-item>
					<div class='add-button'>
						<el-button @click='addCategory(formRef)' type='primary'>确认增加</el-button>
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