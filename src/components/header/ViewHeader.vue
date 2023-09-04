<script setup lang='ts'>
import { defineComponent, defineProps, reactive } from 'vue'
import { User } from '@/interface/user'
import { Edit, SwitchButton } from '@element-plus/icons-vue'
import UpdatePasswordDialog from '@/components/dialog/update/UpdatePasswordDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logoutApi } from '@/api/auth/auth-api'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ userinfo: User | undefined }>()
const components = defineComponent({ edit: Edit, switchButton: SwitchButton })
const data = reactive({
	showUpdatePassword: false
})

const showUpdatePasswordDialog = (): void => {
	data.showUpdatePassword = true
}

const closeUpdatePasswordDialog = (): void => {
	data.showUpdatePassword = false
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
				<el-dropdown>
					<span class='username'>您好,{{props.userinfo?.nickname}}</span>
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

		<update-password-dialog :show='data.showUpdatePassword' @close-update-password-dialog='closeUpdatePasswordDialog' />
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
  font-size: 16px;
  padding: 20px;
  margin-right: 30px;
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