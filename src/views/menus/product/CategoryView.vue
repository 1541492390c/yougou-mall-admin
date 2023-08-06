<template>
	<div class='card'>
		<div class='header'>
			<div>
				<span>商品分类</span>
			</div>
			<div class='add-button'>
				<el-button @click='showAddCategoryDialog' type='primary'>添加一级分类</el-button>
			</div>
		</div>
		<div>
			<el-tree-v2 :data='categoryList' :props='props' :item-size='50'>
				<template #default='{node}'>
					<div style='width: 15%'>
						<span>{{node.label}} [ {{level(node.level)}} ]</span>
					</div>
					<div class='button-item'>
						<el-button @click='updateCategory(node.label)'>修改</el-button>
						<el-button type='danger'>删除</el-button>
					</div>
				</template>
			</el-tree-v2>
		</div>

<!--		<add-category-dialog :show='data.showAddCategory' @closeAddCategoryDialog='closeAddCategoryDialog' />-->
	</div>
</template>

<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue'
import { Category } from '@/interface/product'
import { getCategoryListApi } from '@/api/product/category-api'
import AddCategoryDialog from '@/components/dialog/AddCategoryDialog.vue'

const categoryList = ref<Array<Category>>()
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
            categoryList.value = res.data.data
        }
    }).catch((err) => {
        console.log(err)
    })
}

const updateCategory = (id: number) => {
    console.log(id)
}

const showAddCategoryDialog = (): void => {
    data.showAddCategory = true
}

const closeAddCategoryDialog = (): void => {
    data.parentId = 0
    data.level = 1
    data.showAddCategory = false
}
</script>

<style scoped lang='scss'>
.header {
  font-size: 30px;
  margin: 10px 10px 20px;
  display: flex;
  flex-direction: row;
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
</style>