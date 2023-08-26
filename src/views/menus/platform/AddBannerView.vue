<template>
	<div class='card'>
		<div>
			<span>添加轮播图</span>
		</div>
		<div class='main'>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>轮播图类型</span>
						<el-select v-model='formData.type'>
							<el-option v-for='(item, index) in bannerTypeList'
												 :key='index'
												 :label='item.label'
												 :value='item.value'
												 placeholder='请选择轮播图类型' />
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>轮播图链接</span>
						<el-input v-model='formData.link' placeholder='请输入轮播图链接' size='small' />
					</div>
				</el-col>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>所属页面</span>
						<el-input v-model='formData.page' placeholder='请输入轮播图所属页面' size='small' />
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>简介</span>
						<el-input v-model='formData.description' placeholder='请输入轮播图链接' size='small' type='textarea' />
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>轮播图</span>
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
					</div>
				</el-col>
			</el-row>
			<el-row>
				<div class='flex'>
					<el-button @click='saveBanner' type='primary'>确认添加</el-button>
				</div>
			</el-row>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadFile, UploadProps, UploadRequestOptions } from 'element-plus'
import { UploadFileTypeEnum } from '@/enums'
import { deleteFileApi, uploadFileApi } from '@/api/biz/resource-api'
import { saveBannerApi } from '@/api/platform/banner-api'

const formData = reactive({
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

// 保存轮播图
const saveBanner = () => {
	if (formData.page === '' || formData.img === '' || formData.link === '' || formData.description === '') {
		ElMessage.error('请输入完整信息')
		return
	}
	saveBannerApi(formData).then((res) => {
		if (res) {
			ElMessage.success('添加成功')
			formData.description = ''
			formData.img = ''
			formData.link = ''
			formData.page = ''
			formData.type = 1
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

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

.flex {
	width: 100%;
	display: flex;
	justify-content: center;
}

:deep(.el-upload--picture-card) {
	width: 418px !important;
}
</style>