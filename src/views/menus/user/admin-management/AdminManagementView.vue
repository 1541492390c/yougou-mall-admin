<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue'
import { User } from '@/interface/user'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { getUserPagesApi, updateUserStateApi } from '@/api/user/user-api'
import { UserTypeEnum } from '@/enums'
import defaultAvatar from '@/assets/img/default-avatar.png'
import Pagination from '@/components/pagination/Pagination.vue'
import UpdateRoleDialog from '@/components/dialog/update/UpdateRoleDialog.vue'
import AddAdminDialog from '@/components/dialog/add/AddAdminDialog.vue'

const searchForm = ref<FormInstance>()
const isSearch = ref<boolean>(false)
const total = ref<number>(0)
const currentPage = ref<number>(1)
const currentSize = ref<number>(10)
const currentUserId = ref<number>(0)
const showUpdateRoleDialog = ref<boolean>(false)
const showAddAdminDialog = ref<boolean>(false)
const tableData = ref<Array<User>>()
const stateOptions = ref<Array<any>>([
	{label: '全部', value: undefined},
	{label: '禁用', value: 0},
	{label: '正常', value: 1}
])
const searchData = reactive<Record<string, any>>({
	nickname: '',
	state: undefined
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

const currentPageChange = (value: number): void => {
	currentPage.value = value
	isSearch.value ? search() : getTableData()
}

const getTableData = (): void => {
	getUserPagesApi(currentPage.value, currentSize.value, UserTypeEnum.ADMIN).then((res) => {
		if (res) {
			tableData.value = res.data.list
			total.value = res.data.total
		}
	}).catch((err) => {
		console.log(err)
	})
}

const search = (): void => {
	getUserPagesApi(currentPage.value, currentSize.value, UserTypeEnum.ADMIN, undefined, searchData.state, searchData.nickname).then((res) => {
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

// 更新用户状态
const updateUserState = (userId: number, state: number): void => {
	ElMessageBox.confirm('此操作将更新该用户状态,是否继续?', '更新用户状态').then(() => {
		updateUserStateApi(userId, state).then((res) => {
			if (res) {
				ElMessage.success('操作成功')
			}
		}).catch((err) => {
			console.log(err)
		})
	}).catch(() => {
		ElMessage.info('操作已取消')
	})
}

const openUpdateRoleDialog = (value: number): void => {
	showUpdateRoleDialog.value = true
	currentUserId.value = value
}

const openAddAdminDialog = (): void => {
	showAddAdminDialog.value = true
}

const closeUpdateRoleDialog = (isAdd: boolean): void => {
	showUpdateRoleDialog.value = false
	if (isAdd) {
		location.reload()
	}
}

const closeAddAdminDialog = (): void => {
	showAddAdminDialog.value = false
}
</script>

<template>
	<div class='card'>
		<div class='card-header'>
			<div class='search-bar'>
				<!--搜索栏-->
				<el-form ref='searchForm' :model='searchData' inline class='search-form'>
					<!--昵称-->
					<el-form-item label='昵称:' prop='nickname'>
						<el-input v-model='searchData.nickname' placeholder='请输入昵称' />
					</el-form-item>
					<!--状态-->
					<el-form-item label='状态:' prop='state'>
						<el-select v-model='searchData.state' placeholder='请选择状态'>
							<el-option v-for='(item, index) in stateOptions' :label='item.label' :value='item.value' :key='index' />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='handleReset'>重置</el-button>
						<el-button @click='handleSearch' type='primary'>搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class='add-admin-button'>
				<el-button @click='openAddAdminDialog' type='primary'>添加管理员</el-button>
			</div>
		</div>
		<!--表格数据-->
		<el-table :data='tableData'>
			<!--管理员ID-->
			<el-table-column label='管理员ID' prop='userId' align='center' />
			<!--头像-->
			<el-table-column label='头像' align='center'>
				<template #default='scope'>
					<el-avatar :src='scope.row.avatar ? scope.row.avatar : defaultAvatar' :size='60' alt='' class='product-img' />
				</template>
			</el-table-column>
			<!--昵称-->
			<el-table-column label='昵称' prop='nickname' align='center' />
			<!--状态-->
			<el-table-column label='状态' align='center'>
				<template #default='scope'>
					<span :style="{color: (scope.row.state === 1 ? '#67C23A' : '#F56C6C')}">{{state(scope.row.state)}}</span>
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column label='操作' align='center'>
				<template #default='scope'>
					<el-button @click='updateUserState(scope.row.userId, 0)' v-if='scope.row.state === 1' link type='danger'>禁用</el-button>
					<el-button @click='updateUserState(scope.row.userId, 1)' v-else link type='danger'>启用</el-button>
					<el-button @click='openUpdateRoleDialog(scope.row.userId)' link type='info'>修改权限</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页组件-->
		<pagination :total='total' :size='currentSize' :current='currentPage' @current-change='currentPageChange' />
		<!--更新管理员权限对话框-->
		<update-role-dialog :show='showUpdateRoleDialog' :user-id='currentUserId' @close-dialog='closeUpdateRoleDialog(false)' />
		<!--添加管理员对话框-->
		<add-admin-dialog :show='showAddAdminDialog' @close-dialog='closeAddAdminDialog' />
	</div>
</template>

<style scoped lang='scss'>
.card-header {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.search-bar {
	width: 70%;
	display: flex;
	justify-content: flex-start;
}

.add-admin-button {
	width: 30%;
	display: flex;
	justify-content: flex-end;
	padding-bottom: 25px;
}
</style>