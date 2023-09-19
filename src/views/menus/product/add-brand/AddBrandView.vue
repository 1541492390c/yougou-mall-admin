<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { saveBrandApi } from '@/api/product/brand-api'
import { ElMessage, FormInstance } from 'element-plus'
import { Brand } from '@/interface/product'

const store = useStore()
const form = ref<FormInstance>()
const formData = reactive<Record<string, any>>({
	categoryNode: '',
	name: '',
	description: '',
	img: ''
})

// 选择分类
const handleSelectCategory = (value: Array<number>): void => {
	let categoryNode: string = ''
	for (let index in value) {
		categoryNode += value[index] + '-'
	}
	formData.categoryNode = categoryNode.substring(0, categoryNode.lastIndexOf('-'))
}

// 添加品牌
const addBrand = (form: FormInstance | undefined): void => {
	form?.validate((valid) => {
		if (!valid) {
			return
		}
		saveBrandApi(formData as Brand).then((res) => {
			if (res) {
				ElMessage.success('添加成功')
				form?.resetFields()
			}
		}).catch((err) => {
			console.log(err)
		})
	})
}
</script>

<template>
	<div class='card'>
		<div class='header'>
			<span>添加品牌</span>
		</div>
		<div class='main'>
			<el-form ref='form' :model='formData' label-width='120'>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='品牌分类' prop='categoryNode' required style='width: 100%'>
								<el-cascader :options='store.getters.categoryList' :props="{label: 'name', value: 'categoryId'}"
														 placeholder='请选择分类'
														 @change='handleSelectCategory' style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='品牌名称' prop='name' required style='width: 100%'>
								<el-input v-model='formData.name' placeholder='请输入品牌名称' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='品牌简介' prop='description' required style='width: 100%'>
								<el-input v-model='formData.description' type='textarea' placeholder='请输入品牌简介' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='14'>
						<div class='form-row'>
							<el-form-item label='品牌logo' prop='img' style='width: 100%'>
								<el-upload
												action='#'
												list-type='picture-card'
								>
									<el-icon>
										<Plus />
									</el-icon>
								</el-upload>
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<div class='add-button'>
						<el-button @click='addBrand(form)' type='primary'>确认添加</el-button>
					</div>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.main {
	width: 100%;
}

.add-button {
	margin-top: 20px;
	margin-bottom: 20px;
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>