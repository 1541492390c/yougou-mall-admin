<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { Banner } from '@/interface/platform'
import { deleteBannerApi, getBannerPagesApi, updateBannerApi } from '@/api/platform/banner-api'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'

const isSearch = ref<boolean>(false)
const searchForm = ref<FormInstance>()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(5)
const typeOptions = ref<Array<any>>([
	{value: undefined, label: '全部'},
	{value: 1, label: 'PC端'},
	{value: 2, label: '移动端'},
	{value: 3, label: '小程序端'}
])
const tableData = ref<Array<Banner>>([])
const searchData = reactive<Record<string, any>>({
	type: undefined,
	page: '',
	link: ''
})

onMounted(() => {
	getTableData()
})

// 获取轮播图分页信息
const getTableData = (): void => {
	getBannerPagesApi(currentPage.value, currentSize.value).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 获取轮播图分页信息
const search = (): void => {
	getBannerPagesApi(currentPage.value, currentSize.value, searchData.type, searchData.page).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 搜索
const handleSearch = (): void => {
	isSearch.value = true
	currentPage.value = 1
	search()
}

// 重置
const handleReset = (): void => {
	isSearch.value = false
	currentPage.value = 1
	searchForm.value?.resetFields()
	getTableData()
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	isSearch.value ? search() : getTableData()
}

// 更新轮播图
const updateBanner = (value: Banner): void => {
	updateBannerApi(value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
		}
	}).catch((err) => {
		console.log(err)
	})
}

// 删除轮播图
const deleteBanner = (value: number, index: number): void => {
	ElMessageBox.confirm('此操作将删除轮播图,是否继续?', '删除轮播图').then(() => {
		deleteBannerApi(value).then((res) => {
			if (res) {
				ElMessage.success('删除成功')
				tableData.value.splice(index, 1)
			}
		}).catch((err) => {
			console.log(err)
		}).catch(() => {
			ElMessage.info('操作已取消')
		})
	})
}
</script>

<template>
	<div class='card'>
		<!--搜索栏-->
		<el-form ref='searchForm' :model='searchData' inline class='search-form'>
			<!--所属页面-->
			<el-form-item label='所属页面:' prop='page'>
				<el-input v-model='searchData.page' placeholder='请输入所属页面' />
			</el-form-item>
			<!--轮播图链接-->
			<el-form-item label='轮播图页面:' prop='page'>
				<el-input v-model='searchData.link' placeholder='请输入轮播图页面' />
			</el-form-item>
			<!--所属终端-->
			<el-form-item label='所属终端:' prop='type'>
				<el-select v-model='searchData.type' placeholder='请选择所属终端'>
					<el-option v-for='(item, index) in typeOptions' :value='item.value' :label='item.label' :key='index' />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click='handleReset'>重置</el-button>
				<el-button @click='handleSearch' type='primary'>搜索</el-button>
			</el-form-item>
		</el-form>
		<!--表格数据-->
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--轮播图-->
			<el-table-column label='轮播图' align='center'>
				<template #default='scope'>
					<img :src='scope.row.img' alt='' class='banner-img'>
				</template>
			</el-table-column>
			<!--所属页面-->
			<el-table-column label='所属终端' align='center'>
				<template #default='scope'>
					<el-select v-model='scope.row.type' placeholder='请选择所属终端'>
						<el-option v-for='(item, index) in typeOptions' :value='item.value' :label='item.label' :key='index' />
					</el-select>
				</template>
			</el-table-column>
			<!--所属页面-->
			<el-table-column label='所属页面' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.page' placeholder='请输入所属页面' />
				</template>
			</el-table-column>
			<!--简介-->
			<el-table-column label='简介' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.description' placeholder='请输入简介(选填)' type='textarea' />
				</template>
			</el-table-column>
			<!--链接-->
			<el-table-column label='链接' align='center'>
				<template #default='scope'>
					<el-input v-model='scope.row.link' placeholder='请输入轮播图链接(选填)' />
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateBanner(scope.row)' type='info' link class='button'>编辑</el-button>
					<el-button @click='deleteBanner(scope.row.bannerId, scope.$index)' type='primary' link class='button'>删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<div class='pagination'>
			<el-pagination :total='total' :page-size='currentSize' :current-page='currentPage'
										 @current-change='currentPageChange'
										 small layout='prev, pager, next' background />
		</div>
	</div>
</template>

<style scoped lang='scss'>
.banner-img {
	width: 250px;
	height: 80px;
	border: silver solid 1px;
}
</style>