<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { Category } from '@/interface/product'
import { deleteCategoryApi, getCategoryListApi, updateCategoryApi } from '@/api/product/category-api'
import AddCategoryDialog from '@/components/dialog/add/AddCategoryDialog.vue'
import { isEmpty } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const currentCategory = ref<number>(0)
const currentSecondCategory = ref<number>(0)
const currentThirdCategory = ref<number>(0)
const categoryList = ref<Array<Category>>([])
const secondLevelCategoryList = ref<Array<Category> | undefined>([])
const thirdLevelCategoryList = ref<Array<Category> | undefined>([])
const data = reactive({
	showAddCategory: false,
	level: 1,
	parentId: 0
})

onMounted(() => {
	getCategoryList(data.parentId, data.level)
})

// 获取分类列表
const getCategoryList = (value: number, level: number) => {
	getCategoryListApi().then((res) => {
		if (res) {
			categoryList.value = res.data
			// 二级分类
			if (level === 2) {
				res.data.forEach((item: Category) => {
					if (item.categoryId === value && !isEmpty(item.children)) {
						secondLevelCategoryList.value = item.children
						thirdLevelCategoryList.value = []
					}
				})
			}
			// 三级分类
			if (level === 3 && currentSecondCategory.value !== 0 && !isEmpty(res.data)) {
				res.data.forEach((item: Category) => {
					if (item.categoryId === currentCategory.value && !isEmpty(item.children)) {
						secondLevelCategoryList.value = item.children
						item.children?.forEach((child: Category) => {
							if (child.categoryId === value) {
								thirdLevelCategoryList.value = child.children
							}
						})
					}
				})
			}
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 更新分类
const updateCategory = (value: Category) => {
	updateCategoryApi(value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
			// 更新分类
			store.dispatch('getCategoryList')
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 删除分类
const deleteCategory = (value: number, index: number, level: number) => {
	ElMessageBox.confirm('此操作将删除分类,是否继续?', '删除分类').then(() => {
		deleteCategoryApi(value).then((res) => {
			if (res) {
				ElMessage.success('删除成功')
				// 删除一级分类
				if (level === 1) {
					currentSecondCategory.value = 0
					currentThirdCategory.value = 0
					categoryList.value.splice(index, 1)
					secondLevelCategoryList.value = []
					thirdLevelCategoryList.value = []
				}
				// 删除二级分类
				if (level === 2) {
					currentSecondCategory.value = 0
					secondLevelCategoryList.value?.splice(index, 1)
					thirdLevelCategoryList.value = []
				}
				// 删除三级分类
				if (level === 3) {
					thirdLevelCategoryList.value?.splice(index, 1)
				}
				// 更新分类
				store.dispatch('getCategoryList')
			}
		})
	}).catch(() => {
		ElMessage.info('操作已取消')
	})
}

// 选择分类
const handleSelect = (value: number, level: number): void => {
	// 一级分类
	if (level === 1) {
		currentCategory.value = value
		currentSecondCategory.value = 0
		currentThirdCategory.value = 0
		categoryList.value.forEach((item: Category) => {
			if (item.categoryId === value && !!item.children) {
				secondLevelCategoryList.value = item.children
			}
		})
		thirdLevelCategoryList.value = []
	}
	// 二级分类
	if (level === 2 && !!secondLevelCategoryList.value) {
		currentSecondCategory.value = value
		secondLevelCategoryList.value.forEach((item: Category) => {
			if (item.categoryId === value && !!item.children) {
				thirdLevelCategoryList.value = item.children
			}
		})
	}
}

// 打开添加分类对话框
const showAddCategoryDialog = (level: number, parentId: number): void => {
	data.showAddCategory = true
	data.level = level
	data.parentId = parentId
}

// 关闭添加分类对话框
const closeAddCategoryDialog = (isAdd: boolean, parentId: number, level: number): void => {
	if (isAdd) {
		getCategoryList(parentId, level)
	}
	data.parentId = 0
	data.level = 1
	data.showAddCategory = false
}
</script>

<template>
	<div class='card'>
		<div class='header'>
			<span>商品分类</span>
		</div>
		<div class='category-card-container'>
			<!--一级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<!--分类列表-->
					<div v-for='(item, index) in categoryList' :key='index' class='category-item'>
						<div class='category-item-content'>
							<el-radio v-model='currentCategory' @change='(value) => handleSelect(value, item.level)'
												:label='item.categoryId'>
								<el-input v-model='item.name' />
							</el-radio>
							<div class='option-button'>
								<el-button @click='updateCategory(item)' type='info' link>编辑</el-button>
								<el-button @click='deleteCategory(item.categoryId, index, item.level)' type='danger' link>删除</el-button>
							</div>
						</div>
					</div>
					<!--添加分类按钮-->
					<div class='add-button-content'>
						<el-button v-if='categoryList.length === 0 || categoryList.length < 9'
											 @click='showAddCategoryDialog(1, 0)' class='add-category-button'>
							<el-icon>
								<plus />
							</el-icon>
							<span>添加分类</span>
						</el-button>
					</div>
				</el-scrollbar>
			</div>
			<!--二级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<!--缺省-->
					<el-empty v-if='!secondLevelCategoryList || secondLevelCategoryList.length === 0' description='暂无数据' />
					<!--二级分类列表-->
					<div v-else>
						<div v-for='(item, index) in secondLevelCategoryList' :key='index' class='category-item'>
							<div class='category-item-content'>
								<el-radio v-model='currentSecondCategory' @change='(value) => handleSelect(value, item.level)'
													:label='item.categoryId'>
									<el-input v-model='item.name' />
								</el-radio>
								<div class='option-button'>
									<el-button @click='updateCategory(item)' type='info' link>编辑</el-button>
									<el-button @click='deleteCategory(item.categoryId, index, item.level)' type='danger' link>删除</el-button>
								</div>
							</div>
						</div>
						<!--添加分类按钮-->
						<div class='add-button-content'>
							<el-button v-if='currentCategory !== 0' @click='showAddCategoryDialog(2, currentCategory)'
												 type='danger' class='add-category-button'>
								<el-icon>
									<plus />
								</el-icon>
								<span>添加分类</span>
							</el-button>
						</div>
					</div>
				</el-scrollbar>
			</div>
			<!--三级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<!--缺省-->
					<el-empty v-if='!thirdLevelCategoryList ||thirdLevelCategoryList.length === 0' description='暂无数据' />
					<!--三级分类列表-->
					<div v-else>
						<div v-for='(item, index) in thirdLevelCategoryList' :key='index' class='category-item'>
							<div class='category-item-content'>
								<el-radio v-model='currentThirdCategory' :label='item.categoryId'>
									<el-input v-model='item.name' />
								</el-radio>
								<div class='option-button'>
									<el-button @click='updateCategory(item)' type='info' link>编辑</el-button>
									<el-button @click='deleteCategory(item.categoryId, index, item.level)' type='danger' link>删除</el-button>
								</div>
							</div>
						</div>
						<!--添加分类按钮-->
						<div class='add-button-content'>
							<el-button v-if='currentSecondCategory !== 0' @click='showAddCategoryDialog(3, currentSecondCategory)'
												 type='danger' class='add-category-button'>
								<el-icon>
									<plus />
								</el-icon>
								<span>添加分类</span>
							</el-button>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<add-category-dialog :show='data.showAddCategory' :level='data.level' :parent-id='data.parentId'
												 @closeAddCategoryDialog='closeAddCategoryDialog' />
	</div>
</template>

<style scoped lang='scss'>
.header {
	font-size: 16px;
	margin: 10px 10px 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.add-button {
	margin-left: 20px;
}

:deep(.el-vl__window) {
	height: 100% !important;
}

.button-item {
	margin-left: 20px;
}

.category-card-container {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.category-card {
	width: 33.3%;
	padding-left: 10px;
	padding-right: 10px;
	padding-bottom: 20px;
}

.category-card-item {
	padding: 5px;
	border: #ececec solid 1px;
}

.category-item {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.category-item-content {
	width: 100%;
	padding: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.option-button {
	width: 100%;
	display: flex;
	justify-content: flex-end;
}

.add-category-button {
	width: 100%;
	color: white;
	background-color: #f13a3a;
}

.add-button-content {
	padding: 10px;
}
</style>