<template>
	<div class='card'>
		<div class='header'>
			<span>商品分类</span>
			<div class='add-button'>
				<el-button @click='showAddCategoryDialog' type='primary'>添加一级分类</el-button>
			</div>
		</div>
		<div class='category-card-container'>
			<!--一级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<div v-for='(item, index) in categoryList' :key='index' class='category-item'>
						<div class='category-item-content'>
							<el-radio v-model='currentCategory' @change='(value) => handleSelect(value, item.level)'
												:label='item.categoryId'>
								<el-input v-model='item.name' size='small' />
							</el-radio>
							<div class='delete-button'>
								<el-button type='info' text>编辑</el-button>
								<el-button type='danger' text>删除</el-button>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>
			<!--二级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<el-empty v-if='!secondLevelCategoryList || secondLevelCategoryList.length === 0' description='暂无数据' />
					<div v-else v-for='(item, index) in secondLevelCategoryList' :key='index' class='category-item'>
						<div class='category-item-content'>
							<el-radio v-model='currentSecondCategory' @change='(value) => handleSelect(value, item.level)'
												:label='item.categoryId'>
								<el-input v-model='item.name' size='small' />
							</el-radio>
							<div class='delete-button'>
								<el-button type='danger' text>删除</el-button>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>
			<!--三级分类-->
			<div class='category-card'>
				<el-scrollbar class='category-card-item' height='550'>
					<el-empty v-if='!thirdLevelCategoryList || thirdLevelCategoryList.length === 0' description='暂无数据' />
					<div v-else v-for='(item, index) in thirdLevelCategoryList' :key='index' class='category-item'>
						<div class='category-item-content'>
							<el-radio v-model='currentThirdCategory' :label='item.categoryId'>
								<el-input v-model='item.name' size='small' />
							</el-radio>
							<div class='delete-button'>
								<el-button type='danger' text>删除</el-button>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<!--		<add-category-dialog :show='data.showAddCategory' @closeAddCategoryDialog='closeAddCategoryDialog' />-->
	</div>
</template>

<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue'
import { Category } from '@/interface/product'
import { getCategoryListApi } from '@/api/product/category-api'

const currentCategory = ref<string>()
const currentSecondCategory = ref<string>()
const currentThirdCategory = ref<string>()
const categoryList = ref<Array<Category>>([])
const secondLevelCategoryList = ref<Array<Category> | undefined>([])
const thirdLevelCategoryList = ref<Array<Category> | undefined>([])
const props = {value: 'categoryId', label: 'name', children: 'children'}
const data = reactive({
	showAddCategory: false
})

onMounted(() => {
	getCategoryList()
})

const level = computed(() => (value: number) => {
	switch (value) {
		case 1:
			return '一级分类'
		case 2:
			return '二级分类'
		case 3:
			return '三级分类'
	}
})

const getCategoryList = () => {
	getCategoryListApi().then((res) => {
		if (res) {
			categoryList.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
}


const updateCategory = (id: number) => {
	console.log(id)
}

// 选择分类
const handleSelect = (value: any, level: number): void => {
	// 一级分类
	if (level === 1) {
		currentCategory.value = value
		currentSecondCategory.value = ''
		currentThirdCategory.value = ''
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

const showAddCategoryDialog = (): void => {
	data.showAddCategory = true
}

// const closeAddCategoryDialog = (): void => {
//     data.parentId = 0
//     data.level = 1
//     data.showAddCategory = false
// }
</script>

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
}

.category-card-item {
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

.delete-button {
	width: 100%;
	display: flex;
	justify-content: flex-end;
}
</style>