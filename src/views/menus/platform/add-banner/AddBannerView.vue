<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, UploadFile, UploadProps, UploadRequestOptions } from 'element-plus'
import { UploadFileTypeEnum } from '@/enums'
import { deleteFileApi, uploadFileApi } from '@/api/extra/resource-api'
import { saveBannerApi } from '@/api/platform/banner-api'
import { Banner } from '@/interface/platform'

const form = ref<FormInstance>()
const formData = reactive<Record<string, any>>({
	type: 1,
	page: '',
	link: '',
	description: '',
	img: ''
})
const bannerTypeList = ref<Array<any>>([
	{value: 1, label: 'PC端'},
	{value: 2, label: '移动端'},
	{value: 3, label: '小程序端'}
])

// 移除图片
const handleRemove: UploadProps['onRemove'] = (uploadFile: UploadFile) => {
	console.log(uploadFile)
	deleteFileApi(UploadFileTypeEnum.PRODUCT, uploadFile.name).then((res) => {
		if (res) {
			formData.img = ''
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 上传图片
const uploadFile = (option: UploadRequestOptions): void => {
	let fileData: FormData = new FormData()
	fileData.append('resourceType', UploadFileTypeEnum.PRODUCT.toString())
	fileData.append('file', option.file)
	uploadFileApi(fileData).then((res) => {
		if (res) {
			formData.img = res.data.substring(res.data.lastIndexOf('/') + 1, res.data.length)
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 添加轮播图
const addBanner = (form: FormInstance | undefined) => {
	form?.validate((valid) => {
		if (!valid) {
			return
		}
		saveBannerApi(formData as Banner).then((res) => {
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
			<span>添加轮播图</span>
		</div>
		<div class='main'>
			<el-form ref='form' :model='formData' label-width='120'>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='轮播图类型' prop='type' required style='width: 100%'>
								<el-select v-model='formData.type' style='width: 100%'>
									<el-option v-for='(item, index) in bannerTypeList'
														 :key='index'
														 :label='item.label'
														 :value='item.value'
														 placeholder='请选择轮播图类型' />
								</el-select>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='所属页面' prop='page' required style='width: 100%'>
								<el-input v-model='formData.link' placeholder='请输入轮播图所属页面' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='轮播图链接(选填)' prop='link' style='width: 100%'>
								<el-input v-model='formData.link' placeholder='请输入轮播图链接' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='简介(选填)' prop='link' style='width: 100%'>
								<el-input v-model='formData.description' placeholder='请输入轮播图链接' type='textarea' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='轮播图' prop='img' required style='width: 100%'>
								<el-upload
												action='#'
												list-type='picture-card'
												:limit='1'
												:http-request='uploadFile'
												:on-remove='handleRemove'
												class='upload'
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
						<el-button @click='addBanner' type='primary'>确认添加</el-button>
					</div>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.form-row {
	padding: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.form-title {
	width: 80px;
	font-size: 14px;
}

.add-button {
	margin-top: 20px;
	margin-bottom: 20px;
	width: 100%;
	display: flex;
	justify-content: center;
}

:deep(.el-upload--picture-card) {
	width: 400px !important;
}
</style>