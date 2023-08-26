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
        <el-col :span='12'>
          <div class='form-row'>
            <span class='form-title'>所属品牌</span>
            <el-input v-model='formData.name' placeholder='请输入商品名称' size='small' />
          </div>
        </el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<div class='form-row'>
						<span class='form-title'>商品名称</span>
						<el-input placeholder='请输入商品名称' size='small' />
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

			<div style='padding:35px'>
				<div class='sku-spec'>
					<span>商品规格</span>
					<el-link type='primary' @click='addSpecs' class='sku-spec-add'>添加规格</el-link>
				</div>

				<div class='sku-container' v-for='(attr, index) in attrItem' :key='index'>
					<div class='sku-content'>
						<div class='sku-content-box'>
							<div class='sku-content-left'>
								<el-form label-width='80px' style='width:400px'>
									<el-form-item label='规格名'>
										<el-input v-model='attr.attrName' placeholder='请输入规格名'></el-input>
									</el-form-item>
									<el-form-item label='规格值'>
										<el-tag v-for='item in attr.attrValueList' :key='item' closable :disable-transitions='false'
														@close='handleClose(item, attr)' type='danger'>
											{{item}}
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

				<el-table :data='tableColumnList.tableBodyList' stripe tooltip-effect='dark' border>
          <template #empty>
            <el-empty description='暂无数据' />
          </template>
					<el-table-column :label='item.propName' :property='item.prop' v-for='item in tableColumnList.tableHeaderList'
													 :key='item.prop' align='center' fixed='left'>
						<template #default='scope'>
							<span>{{scope.row[scope.column.property]}}</span>
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
					<el-button @click='addProduct' type='primary'>确认添加</el-button>
				</div>
			</el-row>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { computed, onMounted, reactive, ref, watch, h, VNode } from 'vue'
import { Category } from '@/interface/product'
import { UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteFileApi, uploadFileApi } from '@/api/biz/resource-api'
import { UploadFileTypeEnum } from '@/enums'
import { getCategoryListApi } from '@/api/product/category-api'
import { isEmpty } from '@/utils'

const categoryList = ref<Array<Category>>([])
const fileList = ref<Array<UploadUserFile>>([])

const tableColumnList = ref<any>({
	tableHeaderList: [],
	tableBodyList: []
})
const attrItem = ref<any>([
	{
		attrName: '', //规格名
		attrValueList: [], //规格值数组
		inputVisible: false,
		inputValue: ''
	}
])
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

// 计算规格
const calculateAttr = computed(() => {
	// 初始化
	let obj = Object.create({})
	attrItem.value.forEach((item: any) => {
		// 判断有没有输入规格名
		if (item.attrName) {
			//规格名:规格值     //'颜色':'尺寸'
			obj[item.attrName] = item.attrValueList
		}
	})
	return obj
})

// 计算折扣价格
const discountPrice = computed(() => (value: number) => {
  if (!formData.discount) {
    return '暂无折扣'
  }
  return value * (formData.discount /10)
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

// 添加规格
const addSpecs = (): void => {
	attrItem.value.push({
		attrName: '',
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
		attr.attrValueList.push(val)
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
    console.log(specsStr)
  }
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
</style>