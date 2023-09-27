<script setup lang='ts'>
import { computed, h, onMounted, reactive, ref, VNode, watch } from 'vue'
import { AttrValue, Brand, Sku } from '@/interface/product'
import { FormInstance, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteFileApi, uploadFileApi } from '@/api/extra/resource-api'
import { UploadFileTypeEnum } from '@/enums'
import { isEmpty } from '@/utils'
import { useStore } from 'vuex'
import UploadImage from '@/components/upload-image/UploadImage.vue'
import { getBrandListApi } from '@/api/product/brand-api'
import { saveProductApi } from '@/api/product/product-api'

const store = useStore()
const form = ref<FormInstance>()
const brandList = ref<Array<Brand>>([])
const fileList = ref<Array<UploadUserFile>>([])
const tableColumnList = ref<any>({
	tableHeaderList: [],
	tableBodyList: []
})
const attrItem = ref<any>([
	{
		name: '', //规格名
		attrValueList: [], //规格值数组
		inputVisible: false,
		inputValue: ''
	}
])
const formData = reactive<Record<string, any>>({
	name: '',
	price: 0,
	brandId: undefined,
	discount: undefined,
	recommended: false,
	isDiscount: false,
	categoryNode: ''
})

onMounted(() => {
	getBrandList()
})

// 计算规格
const calculateAttr = computed(() => {
	// 初始化
	let obj = Object.create({})
	attrItem.value.forEach((item: any) => {
		// 判断有没有输入规格名
		if (item.name) {
			//规格名:规格值     //['颜色':'尺寸']
			obj[item.name] = item.attrValueList
		}
	})
	return obj
})

// 计算折扣价格
const discountPrice = computed(() => (value: number) => {
	if (!formData.discount) {
		return '暂无折扣'
	}
	return value * (formData.discount / 10)
})

watch(calculateAttr, (newValue) => {
	let tempNewValue = JSON.parse(JSON.stringify(newValue))
	let attrNames: Array<string> = [] //规格名数组
	let attrValues: Array<string> = [] //规格值数组
	for (let index in tempNewValue) {
		attrNames.push(index)
		attrValues.push(tempNewValue[index])
	}

	// 表格内容数据（笛卡尔积算法）
	let finalArr = cartesianProductOf(...attrValues)

	let tableObj: any = {
		tableBodyList: [],
		tableHeaderList: []
	}
	// 表格内容
	tableObj.tableBodyList = finalArr.map((item: any) => {
		let obj: any = {
			price: 0,
			skuStock: 0,
			description: ''
		}
		for (let i = 0; i < item.length; i++) {
			obj[attrNames[i]] = item[i]
		}
		return obj
	})
	tableColumnList.value.tableBodyList = tableObj.tableBodyList //表格内容数据

	// 表头
	let skuTableArr = Object.keys(newValue)
	tableObj.tableHeaderList = skuTableArr.map((item) => {
		return {
			prop: item,
			propName: item
		}
	})
	tableColumnList.value.tableHeaderList = tableObj.tableHeaderList // 表头

	if (isEmpty(tempNewValue)) {
		tableColumnList.value.tableBodyList = []
	}
}, {deep: true})

// 获取品牌列表
const getBrandList = (): void => {
	getBrandListApi().then((res) => {
		if (res) {
			brandList.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 选择分类
const handleSelectCategory = (value: Array<number>): void => {
	formData.categoryNode = value.join('-')
}

// 添加规格
const addSpecs = (): void => {
	attrItem.value.push({
		name: '',
		attrValueList: [],
		inputVisible: false,
		inputValue: ''
	})
}

// 删除规格值
const deleteSpecs = (index: number): void => {
	attrItem.value.splice(index, 1)
}

// 输入确认
const handleInputConfirm = (val: any, attr: any) => {
	if (val) {
		let attrValue: AttrValue = {name: val}
		attr.attrValueList.push(attrValue)
	}
	attr.inputVisible = false
	attr.inputValue = ''
}

// 动态表格的某列的必填参数
const renderHeader = ({column}: any): VNode => {
	return h('div', [
		h('span', column.label),
		h('span', {
			domProps: {
				innerHTML: '*'
			},
			style: {
				color: 'red',
				fontSize: '16px',
				marginLeft: '5px'
			}
		})
	])
}

const handleClose = (tag: any, item: any): void => {
	item.attrValueList.splice(item.attrValueList.indexOf(tag), 1)
}

const showInput = (value: any) => {
	value.inputVisible = true
}

// 笛卡尔积算法
const cartesianProductOf = (...args: any): any => {
	return args.reduce(
					(total: any, current: any) => {
						let ret: Array<any> = []
						total.forEach((a: any) => {
							current.forEach((b: any) => {
								ret.push(a.concat([b]))
							})
						})
						return ret
					},
					[[]]
	)
}

// 折扣改变
const discountChange = (value: any): void => {
	if (value) {
		formData.discount = 9
	} else {
		formData.discount = null
	}
}

// 上传图片
const uploadFile = (option: UploadRequestOptions): void => {
	let fileData: FormData = new FormData()
	fileData.append('resourceType', UploadFileTypeEnum.PRODUCT.toString())
	fileData.append('file', option.file)
	uploadFileApi(fileData).then((res) => {
		if (res) {
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
	deleteFileApi(UploadFileTypeEnum.PRODUCT, filename).then((res) => {
		if (res) {
			for (let index in fileList.value) {
				if (filename === fileList.value[index].name) {
					fileList.value.splice(parseInt(index), 1)
				}
			}
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 添加商品
const addProduct = (form: FormInstance | undefined): void => {
	form?.validate((valid) => {
		if (!valid) {
			return
		}
		let skuList: Array<any> = []
		for (let index in tableColumnList.value.tableBodyList) {
			let obj: any = tableColumnList.value.tableBodyList[index]
			// 规格
			let specsObj: any = Object.create({})
			// 获取键值
			let keys: Array<string> = Object.keys(obj)
			for (let key in keys) {
				if (keys[key] === 'price' || keys[key] === 'description' || keys[key] === 'skuStock') {
					continue
				}
				specsObj[keys[key]] = obj[keys[key]]
			}
			// 转为字符串格式
			let specsStr: string = JSON.stringify(specsObj)
			// 新增sku
			let sku: Sku = {
				skuStock: obj.skuStock,
				price: obj.price,
				discountPrice: obj.discountPrice,
				description: obj.description,
				skuSpecs: specsStr
			}
			// 是否折扣
			if (!!formData.isDiscount) {
				sku.discountPrice = sku.price * (formData.discount * 0.1)
			}
			skuList.push(sku)
		}
		console.log(formData)
		console.log(skuList)
		console.log(attrItem.value)

		// 构建新增数据
		let value: any = {...formData}
		value.skuList = skuList
		value.attrList = attrItem.value
		// 保存
		saveProductApi(value).then((res) => {
			if (res) {
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
			<span>添加商品</span>
		</div>
		<div class='main'>
			<!--商品基本信息-->
			<el-form ref='form' :model='formData' label-width='120'>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='商品分类' prop='categoryNode' required style='width: 100%'>
								<el-cascader :options='store.state.categoryList' :props="{label: 'name', value: 'categoryId'}"
														 placeholder='请选择分类' @change='handleSelectCategory' style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='所属品牌(选填)' prop='brandId' style='width: 100%'>
								<el-select v-model='formData.brandId' placeholder='请选择品牌' style='width: 100%'>
									<el-option v-for='(item, index) in brandList' :value='item.brandId' :label='item.name' :key='index' style='height: 100%'>
										<div class='brand-option'>
											<img :src='item.img' alt='' />
											<span>{{item.name}}</span>
										</div>
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='商品名称' prop='name' required style='width: 100%'>
								<el-input v-model='formData.name' placeholder='请输入商品名称' />
							</el-form-item>
						</div>
					</el-col>
					<el-col v-if='formData.isDiscount' :span='10'>
						<div class='form-row'>
							<el-form-item label='商品折扣' prop='discount' style='width: 100%'>
								<el-input-number v-model='formData.discount' placeholder='请输入商品折扣' :min='1' :max='9'
																 style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='14'>
						<div class='form-row'>
							<el-form-item label='商品图片'>
								<div class='upload-img'>
									<upload-image v-for='(item, index) in fileList' :url='item.url' :key='index' @remove='handleRemove' />
								</div>
								<el-upload
												v-if='fileList.length < 8'
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
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='是否推荐' prop='recommended' style='width: 100%'>
								<el-switch v-model='formData.recommended' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='是否折扣' prop='isDiscount' style='width: 100%'>
								<el-switch v-model='formData.isDiscount' @change='discountChange' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
			</el-form>

			<!--商品规格-->
			<div style='padding:35px'>
				<div class='sku-spec'>
					<span>商品规格</span>
					<el-link type='primary' @click='addSpecs' class='sku-spec-add'>添加规格</el-link>
				</div>
				<!--sku列表-->
				<div class='sku-container' v-for='(attr, index) in attrItem' :key='index'>
					<div class='sku-content'>
						<div class='sku-content-box'>
							<div class='sku-content-left'>
								<el-form label-width='80px' style='width:400px'>
									<el-form-item label='规格名'>
										<el-input v-model='attr.name' placeholder='请输入规格名'></el-input>
									</el-form-item>
									<el-form-item label='规格值'>
										<el-tag v-for='item in attr.attrValueList' :key='item' closable :disable-transitions='false'
														@close='handleClose(item, attr)' type='danger'>
											{{item.name}}
										</el-tag>
										<el-input
														class='input-new-tag'
														v-if='attr.inputVisible'
														v-model='attr.inputValue'
														size='small'
														@keyup.enter.native='handleInputConfirm(attr.inputValue, attr)'
														@blur='handleInputConfirm(attr.inputValue, attr)'
										/>
										<el-button v-else type='primary' class='button-new-tag' size='small' @click='showInput(attr)'>+
											<span>添加</span>
										</el-button>
									</el-form-item>
								</el-form>
							</div>
							<div class='sku-content-right'>
								<el-link type='danger' @click='deleteSpecs(index as number)'>删除规格</el-link>
							</div>
						</div>
					</div>
				</div>

				<!--商品sku-->
				<el-table :data='tableColumnList.tableBodyList' stripe tooltip-effect='dark' border>
					<template #empty>
						<el-empty description='暂无数据' />
					</template>
					<el-table-column :label='item.propName' :property='item.prop' v-for='item in tableColumnList.tableHeaderList'
													 :key='item.prop' align='center' fixed='left'>
						<template #default='scope'>
							<span>{{scope.row[scope.column.property].name}}</span>
						</template>
					</el-table-column>
					<el-table-column label='价格(元)' :render-header='renderHeader' align='center'>
						<template #default='scope'>
							<el-input-number v-model='scope.row.price' size='small' :min='0' clearable placeholder='请输入价格' />
						</template>
					</el-table-column>
					<el-table-column label='折扣价格(元)' :render-header='renderHeader' align='center'>
						<template #default='scope'>
							<el-input disabled :model-value='discountPrice(scope.row.price)' size='small' placeholder='请输入价格' />
						</template>
					</el-table-column>
					<el-table-column label='库存' :render-header='renderHeader' align='center'>
						<template #default='scope'>
							<el-input-number v-model='scope.row.skuStock' size='small' placeholder='请输入整数' />
						</template>
					</el-table-column>
					<el-table-column label='简介' :render-header='renderHeader' align='center'>
						<template #default='scope'>
							<el-input v-model='scope.row.description' size='small' placeholder='请输入简介' />
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-row>
				<div class='add-button'>
					<el-button @click='addProduct(form)' type='primary'>确认添加</el-button>
				</div>
			</el-row>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.main {
	width: 100%;
}

.attr-title {
	width: 120px;
	font-size: 14px;
}

.edit-button {
	height: 40px;
	margin-left: 10px;
}

.add-button {
	margin-top: 20px;
	margin-bottom: 20px;
	width: 100%;
	display: flex;
	justify-content: center;
}

.attr-card {
	padding: 20px;
	margin: 20px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border: #CDD0D6 solid 1px;
	background-color: #FFFFFF;
}

.attr-input {
	height: 30px;
}


.sku-spec {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.sku-spec .sku-spec-add {
	margin-right: 15px;
}

.sku-container .button-new-tag {
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}

.sku-container .input-new-tag {
	width: 90px;
	margin-right: 10px;
	vertical-align: bottom;
}

.sku-container .el-tag {
	margin-right: 10px;
}

.sku-container .sku-content {
	margin-bottom: 10px;
	padding: 14px;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	background-color: #fcfcfc;
}

.sku-content .sku-content-box {
	display: flex;
	align-items: center;
}

.sku-content-box .sku-content-left {
	flex: 1;
}

.upload-img {
	padding-top: 10px;
}

.brand-option {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	img {
		width: 60px;
		height: 60px;
		margin: 10px;
	}
}
</style>