<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { saveBrandApi } from '@/api/product/brand-api'
import { ElMessage, FormInstance, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { Brand } from '@/interface/product'
import { UploadFileTypeEnum } from '@/enums'
import { deleteFileApi, uploadFileApi } from '@/api/extra/resource-api'
import UploadImage from '@/components/upload-img/UploadImage.vue'

const store = useStore()
const form = ref<FormInstance>()
const fileList = ref<Array<UploadUserFile>>([])
const categoryOptions = ref<Array<number>>([])
const formData = reactive<Record<string, any>>({
	categoryNode: '',
	name: '',
	description: '',
	img: ''
})

// 选择分类
const handleSelectCategory = (value: Array<number>): void => {
	formData.categoryNode = value.join('-')
}

// 上传图片
const uploadFile = (option: UploadRequestOptions): void => {
	let fileData: FormData = new FormData()
	fileData.append('resourceType', UploadFileTypeEnum.BRAND.toString())
	fileData.append('file', option.file)
	uploadFileApi(fileData).then((res) => {
		if (res) {
			formData.img = res.data
			// 添加文件列表
			let fileName: string = res.data.substring(res.data.lastIndexOf('/') + 1, res.data.length)
			fileList.value.push({name: fileName, url: res.data})
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 移除图片
const handleRemove = (url: string) => {
	let filename = url.substring(url.lastIndexOf('/') + 1)
	deleteFileApi(UploadFileTypeEnum.BRAND, filename).then((res) => {
		if (res) {
			formData.img = ''
			fileList.value.splice(0, 1)
			ElMessage.success('移除图片成功')
		}
	}).catch((err) => {
		console.log(err)
	})
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
				categoryOptions.value = []
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
								<el-cascader v-model='categoryOptions' :options='store.getters.categoryList'
														 :props="{label: 'name', value: 'categoryId'}"
														 @change='handleSelectCategory' placeholder='请选择分类' style='width: 100%' />
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
								<div class='upload-img'>
									<upload-image v-for='(item, index) in fileList' :url='item.url' :key='index' @remove='handleRemove' />
								</div>
								<el-upload
												v-if='fileList.length === 0'
												action='#'
												list-type='picture-card'
												:show-file-list='false'
												:http-request='uploadFile'
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

.upload-img {
	padding-top: 10px;
}
</style>