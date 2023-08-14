<template>
	<div class='card'>
		<div>
			<span>添加商品</span>
		</div>
		<div class='main'>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品分类</span>
						<el-cascader :options='categoryList' :props="{label: 'name', value: 'categoryId'}" placeholder='请选择分类'
												 @change='handleSelectCategory' style='width: 100%' />
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品名称</span>
						<el-input v-model='formData.name' placeholder='请输入商品名称' size='small' />
					</div>
				</el-col>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品名称</span>
						<el-input placeholder='请输入商品名称' size='small' />
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品价格</span>
						<el-input-number v-model='formData.price' placeholder='请输入商品价格' :min='0' size='small'
														 style='width: 100%' />
					</div>
				</el-col>
				<el-col v-if='formData.isDiscount' :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品折扣</span>
						<el-input-number v-model='formData.discount' placeholder='请输入商品折扣' :min='1' :max='9'
														 size='small' style='width: 100%' />
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品图片</span>
						<el-upload
										action='#'
										list-type='picture-card'
										v-model:file-list='fileList'
										:limit='8'
										:http-request='uploadFile'
										:on-remove='handleRemove'
						>
							<el-icon>
								<Plus />
							</el-icon>
						</el-upload>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>是否推荐</span>
						<el-switch v-model='formData.recommended' />
					</div>
				</el-col>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>是否折扣</span>
						<el-switch v-model='formData.isDiscount' @change='discountChange' />
					</div>
				</el-col>
			</el-row>
			<!--			<el-row>-->
			<!--				<el-col :span='12'>-->
			<!--					<div class='form-row'>-->
			<!--						<span class='attr-title'>商品属性</span>-->
			<!--						<el-input v-model='attrInput' placeholder='请填写新属性' size='small' />-->
			<!--						<el-button @click='addAttr' type='primary' class='edit-button'>确认添加</el-button>-->
			<!--					</div>-->
			<!--				</el-col>-->
			<!--			</el-row>-->
			<!--			<el-row v-if='attrList.length !== 0'>-->
			<!--				<div class='tag-container'>-->
			<!--					<el-tag closable v-for='(item, index) in attrList' :key='index' type='danger' @close='deleteAttr(index)'-->
			<!--									style='margin: 5px'>-->
			<!--						{{item.name}}-->
			<!--					</el-tag>-->
			<!--				</div>-->
			<!--			</el-row>-->
			<el-row>
				<div class='flex'>
					<el-button type='primary'>确认添加</el-button>
				</div>
			</el-row>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { Attr, Category } from '@/interface/product'
import { ElMessage, UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteFileApi, uploadFileApi } from '@/api/biz/resource-api'
import { UploadFileTypeEnum } from '@/enums'
import { getCategoryListApi } from '@/api/product/category-api'

const categoryList = ref<Array<Category>>([])
const fileList = ref<Array<UploadUserFile>>([])
const attrList = ref<Array<Attr>>([])
const attrInput = ref<string>('')
const formData = reactive<any>({
	name: '',
	price: 0,
	discount: null,
	recommended: false,
	isDiscount: false,
	categoryNode: ''
})

onMounted(() => {
	getCategoryList()
})

// 获取分类列表
const getCategoryList = (): void => {
	getCategoryListApi().then((res) => {
		if (res) {
			categoryList.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 选择分类
const handleSelectCategory = (value: Array<number>): void => {
	let categoryNode: string = ''
	for (let index in value) {
		categoryNode += value[index] + '-'
	}
	formData.categoryNode = categoryNode.substring(0, categoryNode.lastIndexOf('-'))
}

// 添加属性
const addAttr = (): void => {
	for (let index in attrList.value) {
		if (attrList.value[index].name === attrInput.value) {
			ElMessage.error('该属性已存在')
			return
		}
	}
	let attr: Attr = {name: attrInput.value}
	attrList.value.push(attr)
	attrInput.value = ''
}

// 删除属性
const deleteAttr = (index: number): void => {
	attrList.value.splice(index, 1)
}

const discountChange = (value: any): void => {
	if (value) {
		formData.discount = 9
	} else {
		formData.discount = null
	}
}

// 上传图片
const uploadFile = (option: UploadRequestOptions): void => {
	let formData: FormData = new FormData()
	formData.append('resourceType', UploadFileTypeEnum.PRODUCT.toString())
	formData.append('file', option.file)
	uploadFileApi(formData).then((res) => {
		if (res) {
			let fileName: string = res.data.substring(res.data.lastIndexOf('/') + 1, res.data.length)
			fileList.value.push({name: fileName, url: res.data})
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 移除图片
const handleRemove: UploadProps['onRemove'] = (uploadFile: UploadFile) => {
	console.log(uploadFile)
	deleteFileApi(UploadFileTypeEnum.PRODUCT, uploadFile.name).then((res) => {
		if (res) {
			for (let index in fileList.value) {
				if (uploadFile.name === fileList.value[index].name) {
					fileList.value.splice(parseInt(index), 1)
				}
			}
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 添加商品
const addProduct = (): void => {
}
</script>

<style scoped lang='scss'>
.main {
	width: 100%;
}

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

.attr-title {
	width: 120px;
	font-size: 14px;
}

.edit-button {
	height: 40px;
	margin-left: 10px;
}

.tag-container {
	margin-left: 30px;
}

.flex {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>