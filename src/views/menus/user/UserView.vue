<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue'
import { getUserPagesApi, updateUserStateApi } from '@/api/user/user-api'
import { User } from '@/interface/user'
import Pagination from '@/components/pagination/Pagination.vue'
import defaultAvatar from '@/assets/img/default-avatar.png'
import { ElMessage, ElMessageBox } from 'element-plus'

const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const tableData = ref<Array<User>>()
const genderOptions = ref<Array<any>>([{label: '保密', value: 0}, {label: '男', value: 1}, {label: '女', value: 2}])
const stateOptions = ref<Array<any>>([{label: '禁用', value: 0}, {label: '正常', value: 1}])
const searchData = reactive<Record<string, any>>({
	nickname: '',
	state: 1,
	gender: 0
})

const gender = computed(() => (value: number) => {
	switch (value) {
		case 0:
			return '保密'
		case 1:
			return '男'
		case 2:
			return '女'
	}
})

onMounted(() => {
	getTableData()
})

const state = computed(() => (value: number) => {
	switch (value) {
		case 1:
			return '正常'
		case 0:
			return '禁用'
	}
})

const getTableData = (): void => {
	getUserPagesApi(currentPage.value).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const currentPageChange = (value: number): void => {
	currentPage.value = value
	getTableData()
}

// 更新用户状态
const updateUserState = (userId: number, state: number): void => {
	ElMessageBox.confirm('此操作将删除商品,是否继续?', '删除商品').then(() => {
		updateUserStateApi(userId, state).then((res) => {
			if (res) {
				ElMessage.success('修改成功')
			}
		}).catch((err) => {
			console.log(err)
		})
	}).catch(() => {
		ElMessage.info('操作已取消')
	})
}
</script>

<template>
	<div class='card'>
		<!--搜索栏-->
		<el-form :model='searchData' inline class='search-form'>
			<!--昵称-->
			<el-form-item label='昵称:' prop='nickname'>
				<el-input v-model='searchData.nickname' placeholder='请输入昵称' />
			</el-form-item>
			<!--性别-->
			<el-form-item label='性别:' prop='gender'>
				<el-select v-model='searchData.gender' placeholder='请选择性别'>
					<el-option v-for='(item, index) in genderOptions' :label='item.label' :value='item.value' :key='index' />
				</el-select>
			</el-form-item>
			<!--状态-->
			<el-form-item label='状态:' prop='state'>
				<el-select v-model='searchData.state' placeholder='请选择状态'>
					<el-option v-for='(item, index) in stateOptions' :label='item.label' :value='item.value' :key='index' />
				</el-select>
			</el-form-item>
			<el-form-item>
				<div>
					<el-button>重置</el-button>
					<el-button type='primary'>搜索</el-button>
				</div>
			</el-form-item>
		</el-form>
		<!--表格数据-->
		<el-table :data='tableData'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<!--头像-->
			<el-table-column label='头像' align='center'>
				<template #default='scope'>
					<el-avatar :src='scope.row.avatar ? scope.row.avatar : defaultAvatar' :size='60' alt='' class='product-img' />
				</template>
			</el-table-column>
			<!--昵称-->
			<el-table-column label='昵称' prop='nickname' align='center' />
			<!--性别-->
			<el-table-column label='性别' align='center'>
				<template #default='scope'>
					<span>{{gender(scope.row.gender)}}</span>
				</template>
			</el-table-column>
			<!--生日-->
			<el-table-column label='生日' prop='birthday' align='center'>
				<template #default='scope'>
					<span>{{scope.row.birthday ? scope.row.birthday : '--'}}</span>
				</template>
			</el-table-column>
			<!--状态-->
			<el-table-column label='状态' align='center'>
				<template #default='scope'>
					<span :style="{color: (scope.row.state === 1 ? '#67C23A' : '#F56C6C')}">{{state(scope.row.state)}}</span>
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateUserState(scope.row.userId, 0)' v-if='scope.row.state === 1' link type='danger'>
						禁用
					</el-button>
					<el-button @click='updateUserState(scope.row.userId, 1)' v-else link type='danger'>启用</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
	</div>
</template>

<style scoped lang='scss'>
</style>