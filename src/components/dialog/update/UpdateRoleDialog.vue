<script setup lang='ts'>
import { computed, ref } from 'vue'
import { AuthAccount } from '@/interface/auth'
import { getAuthByUserIdApi, updateAdminRoleApi } from '@/api/auth/auth-api'
import { ElMessage } from 'element-plus'

const props = defineProps<{ show: boolean, userId: number }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()
const authInfo = ref<AuthAccount>()
const currentRole = ref<string>('')

const showDialog = computed(() => {
	return props.show
})

const openDialog = (): void => {
	getAuthByUserIdApi(props.userId).then((res) => {
		if (res) {
			authInfo.value = res.data
			currentRole.value = res.data.role
		}
	}).catch((err) => {
		console.log(err)
	})
}

const closeDialog = (): void => {
	emits('closeDialog')
}

const updateAdminRole = (): void => {
	updateAdminRoleApi(authInfo.value?.authAccountId, currentRole.value).then((res) => {
		if (res) {
			ElMessage.success('修改成功')
			closeDialog()
		}
	}).catch((err) => {
		console.log(err)
	})
}
</script>

<template>
	<el-dialog v-model='showDialog' title='管理员权限' center @open='openDialog' @close='closeDialog'>
		<el-form :model='authInfo'>
			<el-form-item prop='role'>
				<el-radio-group v-model='currentRole'>
					<el-radio label='COMMON_ADMIN'>普通管理员</el-radio>
					<el-radio label='SUPER_ADMIN'>超级管理员</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<div class='form-bottom'>
					<el-button @click='updateAdminRole' type='primary'>确认修改</el-button>
				</div>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style scoped lang='scss'>
.flex {
	width: 100%;
	display: flex;
	justify-content: center;
}

.form-bottom {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>