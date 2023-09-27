<script setup lang='ts'>
import { defineComponent, ref, watchEffect } from 'vue'
import { Edit, SwitchButton } from '@element-plus/icons-vue'
import UpdatePasswordDialog from '@/components/dialog/update/UpdatePasswordDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logoutApi } from '@/api/auth/auth-api'
import { RouteLocationMatched, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const components = defineComponent({ edit: Edit, switchButton: SwitchButton })
const routeTitleList = ref<Array<string>>([])
const showUpdatePassword = ref<boolean>(false)

watchEffect(() => {
	routeTitleList.value = []
	router.currentRoute.value.matched.forEach((item: RouteLocationMatched) => {
		routeTitleList.value.push(item.meta.title)
	})
})

const showUpdatePasswordDialog = (): void => {
	console.log(store.getters.userinfo)
	showUpdatePassword.value = true
}

const closeUpdatePasswordDialog = (): void => {
	showUpdatePassword.value = false
}

const logout = (): void => {
	ElMessageBox.confirm('此操作将退出登录，是否继续?', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		callback: () => {
			logoutApi().then((res) => {
				if (res) {
					localStorage.removeItem('token')
					router.replace('/')
					ElMessage.success('退出登录成功')
				}
			}).catch((err) => {
				console.log(err)
			})
		}
	})
}
</script>

<template>
	<div class='main'>
		<div class='select-bar'>
			<div class='select-bar-block'>
				<el-breadcrumb class='breadcrumb'>
					<el-breadcrumb-item v-for='(item, index) in routeTitleList' :key='index'>{{item}}</el-breadcrumb-item>
				</el-breadcrumb>
				<el-dropdown class='dropdown'>
					<span class='username'>您好,{{store.getters.userinfo.nickname}}</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item :icon='components.edit' @click='showUpdatePasswordDialog'>
								<span>修改密码</span>
							</el-dropdown-item>
							<el-dropdown-item :icon='components.switchButton' @click='logout'>
								<span>退出登录</span>
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<!--更新密码对话框-->
		<update-password-dialog :show='showUpdatePassword' @close-dialog='closeUpdatePasswordDialog' />
	</div>
</template>

<style scoped lang='scss'>
.main {
  box-shadow: 0 2px 5px -5px gray;
}

.select-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.select-bar-block {
	width: 100%;
	display: flex;
	flex-direction: row;
  font-size: 16px;
  padding: 20px;
  margin-right: 30px;
}

.breadcrumb {
	width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	justify-items: center;
}

.dropdown {
	width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	justify-items: center;
}

.username {
  display: flex;
  flex-direction: row;
  justify-items: center;

  &:hover {
    cursor: pointer;
    color: #f13a3a;
  }
}

.arrow-down {
  padding-top: 3px;
}

:deep(.el-tooltip__trigger):focus {
  outline: none;
}
</style>